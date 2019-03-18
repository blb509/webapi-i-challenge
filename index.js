// implement your API here
const express = require("express");
const db = require("./data/db.js");
const server = express();

server.use(express.json());

server.listen(4000, () => {
  console.log("\n** API up and running on port 4k **");
});

server.get("/", (req, res) => {
  res.send("API Working");
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(response => {
      if (response.length === 0) {
        return res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
      res.status(200).json(response);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

server.post("/api/users", (req, res) => {
  const { name, bio, created_at, updated_at } = req.body;
  if (!name || !bio) {
    return res
      .status(400)
      .json({ message: "Please provide name and bio for the user." });
  }
  db.insert({
    name,
    bio,
    created_at,
    updated_at
  })
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      res.status(500).json({
        message: "There was an error while saving the user to the database"
      });
      return;
    });
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(response => {
      if (response.length === 0) {
        return res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});
