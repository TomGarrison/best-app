var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var userPath = path.join(__dirname,'../user.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// post route because from submission is a POST
router.post('/',function(req, res, next) {
  // getting request data from the html form
  var user = req.body.username;

  if(!user){
    res.render('index',{error:'You suck'})
  }
  else{
    // database stuff
    fs.readFile(userPath,'utf8',(err,data) => {
      if(err) throw err;
      const users = JSON.parse(data);
      const sortedUsers = users.sort(function(a,b){
        return a.points - b.points;
      })
      console.log(sortedUsers);
      var exsists = false;
      for (var i = 0; i < users.length; i++) {
        let name = users[i].name;
        if(name ===user){
          exsists = true;
          let updatedPoints = parseInt(users[i].points) + 5;
          users[i].points = updatedPoints;
        }
      }
      console.log(users);
      if(!exsists){
        users.push({
          name:user,
          points:15
        });
      }
      fs.writeFile(userPath, JSON.stringify(users), function(err){
        if(err) throw err;
      })
      users.sort((a,b) =>{
        return b.points - a.points;
      });
      let topThree = users.slice(0,3);
      console.log(topThree);
      res.redirect('/question');
    });
    //res.end();
  }
});

module.exports = router;
