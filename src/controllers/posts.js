const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ItemType = require("../models/itemtype");
const Item = require("../models/item");
const BoxOfItems = require("../models/boxofitems");
const Sold = require("../models/sold");
var _ = require('underscore');

const Mongoose = require("mongoose");
var async = require("async");
const { system } = require("nodemon/lib/config");

const jwtSecret =
  "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";

// NOT WORKING


  // Get boxes - delete boxes, get items - delete items
exports.deleteItemType = async (req, res, next) => {
  try {
    const {_id} = req.body;
      Item.countDocuments({itemTypeID : _id}, function (err, result) {
        if (err) return handleError(err);
        else if(result<1) {
          const query = ItemType.deleteOne({_id : _id});
          // execute the query at a later time
          var temp = query.exec(function (err, result) {
            if (err) return handleError(err);
            var transresult = result;
            console.log(transresult)
            return transresult;
          })
          res.status(200).send("Deleted Successfully");
        }    
        else {
          res.status(200).send("You Cannot Delete an ItemType if there are is Stock within Inventory");
        }    
        var transresult = result;
        console.log(transresult)
        return transresult;
      })

    }
  catch (error) {
    if (error instanceof Error) {
        res.status(500).send(error.message);
    } else {
        res.status(500).send('Unexpected Error');
    }
}
};


// WORKING


exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
          role: user.role,
        });
      })
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};

exports.login = async (req, res, next) => {
  var { username, password } = req.body;
  //Cast to string to prevent object Injection (in conjunction with middleware)
  username = String(username);
  password = String(password);

  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
            role: user.role,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const { role, id } = req.body;
  // Verifying if role and id is presnt
  if (role && id) {
    // Verifying if the value of role is admin
    if (role === "admin") {
      // Finds the user with the id
      await User.findById(id)
        .then((user) => {
          // Verifies the user is not an admin
          if (user.role !== "admin") {
            user.role = role;
            user.save((err) => {
              //Monogodb error checker
              if (err) {
                return res
                  .status("400")
                  .json({ message: "An error occurred", error: err.message });
                process.exit(1);
              }
              res.status("201").json({ message: "Update successful", user });
            });
          } else {
            res.status(400).json({ message: "User is already an Admin" });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: "An error occurred", error: error.message });
        });
    } else {
      res.status(400).json({
        message: "Role is not admin",
      });
    }
  } else {
    res.status(400).json({ message: "Role or Id not present" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => user.remove())
    .then((user) =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    );
};


exports.getUsers = async (req, res, next) => {
  await User.find({})
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.username = user.username;
        container.role = user.role;
        container.id = user._id;

        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};

exports.getinfo = async (req, res, next) => {
  try {
      getinfo = "Inventory API - PFS Assignment 2 - Jacqui Meacle, Nathan Kafer & Sophie Coyte";
      res.status(200).send(getinfo)
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(500).send('Unexpected Error');
      }
  }
};

exports.getAllItemType = (req, res, next) => {
  try {
    const query = ItemType.find();
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      var transresult = result.map(function(ItemType) {
          return ItemType.toJSON();
      });
      res.status(200).send(transresult);
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(500).send('Unexpected Error');
      }
  }
};

exports.getAllItem = (req, res, next) => {
  try {
    const query = Item.find();
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      var transresult = result.map(function(Item) {
          return Item.toObject();
      });
      res.status(200).send(transresult);
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(500).send('Unexpected Error');
      }
  }
};

exports.getallBoxes = (req, res, next) => {
  try {
    const query = BoxOfItems.find();
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      var transresult = result.map(function(BoxOfItems) {
          return BoxOfItems.toObject();
      });
      res.status(200).send(transresult);
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(500).send('Unexpected Error');
      }
  }
};

exports.getItemTypeByID = (req, res, next) => {
  try {
    const {_id} = req.body;
    const query = ItemType.findById(_id);
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      if (result!=null) {
        res.status(200).send(result);
      } else {
        res.status(400).send(`"_id": ${JSON.stringify(_id)} Does Not Exist in itemtypes`);
      }
      
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(500).send('Unexpected Error');
      }
  }
};

exports.getItemByID = (req, res, next) => {
  try {
    const {_id} = req.body;
    const query = Item.findById(_id);
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      if (result!=null) {
        res.status(200).send(result);
      } else {
        res.status(400).send(`"_id": ${JSON.stringify(_id)} Does Not Exist in items`);
      }
      
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(500).send('Unexpected Error');
      }
  }
};

exports.getBoxByID = (req, res, next) => {
  try {
    const {_id} = req.body;
    const query = BoxOfItems.findById(_id);
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      if (result!=null) {
        res.status(200).send(result);
      } else {
        res.status(400).send(`"_id": ${JSON.stringify(_id)} Does Not Exist in boxofitems`);
      }
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.getItemTypeBySupplier = (req, res, next) => {
  try {
    const {supplier} = req.body;
    const query = ItemType.find({ supplier: supplier});
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      var transresult = result.map(function(ItemType) {
          return ItemType.toObject();
      });
      res.status(200).send(transresult);
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.getItemTypeBySell = (req, res, next) => {
  try {
    const {Min,Max} = req.body;
    const query = ItemType.find({itemSel : { $gte :  Min},itemSel : { $lte :  Max}});
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      var transresult = result.map(function(ItemType) {
          return ItemType.toObject();
      });
      res.status(200).send(transresult);
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.getItemTypeByCost = (req, res, next) => {
  try {
    const {Min,Max} = req.body;
    const query = ItemType.find({itemCost : { $gte :  Min},itemCost : { $lte :  Max}});
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      var transresult = result.map(function(ItemType) {
          return ItemType.toObject();
      });
      res.status(200).send(transresult);
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.getBoxesByItemType = async (req, res, next) => {
  try {
    const {itemTypeID} = req.body;
    const query = Item.distinct("boxID").find({ itemTypeID: itemTypeID}).select("boxID -_id").populate('boxID');
    query.exec(function (err, result) {
        if (err) return handleError(err);
        var transresult = result.map(function(ItemType) {
            return ItemType.toObject();
        }); 
        var cleaned = [];
        transresult.forEach(function(itm) {
            var unique = true;
            cleaned.forEach(function(itm2) {
                if (_.isEqual(itm, itm2)) unique = false;
            });
            if (unique)  cleaned.push(itm);
        });

        res.status(200).send(cleaned);
      });
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.getItemsByItemType = (req, res, next) => {
  try {
    const {itemTypeID} = req.body;
    const query = Item.find({ itemTypeID: itemTypeID});
    query.exec(function (err, result) {
        if (err) return handleError(err);
        var transresult = result.map(function(ItemType) {
            return ItemType.toObject();
        }); 
        res.status(200).send(transresult);
      });
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.getItemCount = (req, res, next) => {
  try {
    const {itemTypeID} = req.body;
    console.log(itemTypeID);
    Item.countDocuments({itemTypeID : itemTypeID}, function (err, result) {
      if(result>1) {
        console.log(result);
        temp = {"result" : result};
        res.status(200).send(temp);
      }
      else {
        res.status(500).send(`"_id": ${(itemTypeID)} Does Not Exist in itemType`);
      }
    }
    );
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};


exports.getItemsByBoxID = (req, res, next) => {
  try {
    const {boxID} = req.body;
    const query = Item.find( { boxID: { $eq: boxID}});
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      var transresult = result.map(function(Item) {
          return Item.toObject();
      });
      res.status(200).send(transresult);
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.AddItemType = (req, res, next) => {
  try {
     
    const {_id,itemName,itemSel,itemCost,supplier } = req.body;
    var temp = new Mongoose.Types.ObjectId(_id);
    var ItemTypenew = new ItemType(
      {_id: temp, itemName: itemName,
      itemSel: itemSel,
      itemCost: itemCost,
      supplier: supplier}
    );
    ItemTypenew.save(function (err, ItemTypenew) {
      if (err) { return next(err) }
      res.json(201, ItemTypenew)
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.AddItems = (req, res, next) => {
  try {
     
    const {_id,boxID,itemTypeID } = req.body;
      var Itemnew = new Item(
        {
          _id: new Mongoose.Types.ObjectId(_id),
          boxID: new Mongoose.Types.ObjectId(boxID),
          itemTypeID: new Mongoose.Types.ObjectId(itemTypeID)
        }
      );
      Itemnew.save(function (err, Itemnew) {
        if (err) { return next(err) }
          res.status(201).send(Itemnew);
      })
  
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
}

exports.UpdateCost = (req, res, next) => {
  try {
     
    const {_id,newCost } = req.body;
    ItemType.findByIdAndUpdate(_id, { itemCost: newCost },
    function (err, docs) {
    if (err){
    console.log(err)
    }
    else{
    res.status(200).send(docs);
    }
      })
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.UpdateSell = (req, res, next) => {
  try {
     
    const {_id,newSell } = req.body;
    ItemType.findByIdAndUpdate(_id, { itemSel: newSell },
    function (err, docs) {
    if (err){
    console.log(err)
    }
    else{
    res.status(200).send(docs);
    }
      })
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.MoveItem = (req, res, next) => {
  try {
     
    const {_id,NewboxID } = req.body;
    Item.findByIdAndUpdate(_id, { boxID: NewboxID },
    function (err, docs) {
    if (err){
    console.log(err)
    }
    else{
    res.status(200).send(docs);
    }
      })
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.MoveBox = (req, res, next) => {
  try {
     
    const {_id,newLocation } = req.body;
    BoxOfItems.findByIdAndUpdate(_id, { location: newLocation },
    function (err, docs) {
    if (err){
    console.log(err)
    }
    else{
    res.status(200).send(docs);
    }
      })
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.UpdateRFID = (req, res, next) => {
  try {
     
    const {currentRFID,newRFID } = req.body;
    BoxOfItems.findOneAndUpdate({RFIDSerialNumber:currentRFID}, { RFIDSerialNumber: newRFID },
    function (err, docs) {
    if (err){
    console.log(err)
    }
    else{
    res.status(200).send(docs);
    }
      })
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.BoxByRFID = (req, res, next) => {
  try {
    const {RFIDSerialNumber} = req.body;
    const query = BoxOfItems.find({RFIDSerialNumber: RFIDSerialNumber});
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      if (result!=null) {
        res.status(200).send(result);
      } else {
        res.status(400).send(`"_id": ${JSON.stringify(_id)} Does Not Exist in boxofitems`);
      }
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.getItemTypeByName = (req, res, next) => {
  try {
    const {itemName} = req.body;
    const query = ItemType.findOne({ itemName: itemName});
    // execute the query at a later time
    query.exec(function (err, result) {
      if (err) return handleError(err);
      if (result!=null) {
        res.status(200).send(result);
      } else {
        res.status(400).send(`"_id": ${JSON.stringify(itemName)} Does Not Exist in boxofitems`);
      }
    })
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.LocationByItemType = async (req, res, next) => {
  try {
    const {itemTypeID} = req.body;
    const query = Item.distinct("boxID").find({ itemTypeID: itemTypeID}).select("boxID -_id").populate('boxID','location');
    query.exec(function (err, result) {
        if (err) return handleError(err);
        var transresult = result.map(function(ItemType) {
            return ItemType.toObject();
        }); 
        var cleaned = [];
        transresult.forEach(function(itm) {
            var unique = true;
            cleaned.forEach(function(itm2) {
                if (_.isEqual(itm, itm2)) unique = false;
            });
            if (unique)  cleaned.push(itm);
        });

        res.status(200).send(cleaned);
      });
    
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};

exports.SellItem = (req, res, next) => {
  try {
     
    const {_id,time} = req.body;
      var Itemnew = new Sold(
        {
          _id: new Mongoose.Types.ObjectId(time),
          boxID: new Mongoose.Types.ObjectId(_id),
        }
      );
      Itemnew.save(function (err, Itemnew) {
        if (err) { return next(err) }
      })
      const query = Item.deleteMany({boxID : _id});
      const query2 = BoxOfItems.deleteOne({ _id : _id})
      // execute the query at a later time
      var temp = query.exec(function (err, result) {
        if (err) return handleError(err);
        var transresult = result;
        console.log(transresult)
        return transresult;
      })
      var temp2 = query2.exec(function (err, result) {
        if (err) return handleError(err);
        var transresult2 = result;
        console.log(transresult2)
        return transresult2;
      })
      var string = temp + temp2;
      res.status(200).send(string);
    }

  catch (error) {
      if (error instanceof Error) {
          res.status(500).send(error.message);
      } else {
          res.status(400).send(error.message);
      }
  }
};