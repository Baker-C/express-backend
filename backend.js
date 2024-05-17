import express from "express";
import cors from "cors"
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

  // checks that id does not match existing, true if duplicate does not exist
  function duplicateID(id) {
    const duplicate = users["users_list"].filter((user) => {
      return (id == user?.id);
    });
    return duplicate.length > 0
  }

  // generates random id of 3 letters and 3 numbers
  function randomID() {
    // func for random integers
    const randomInt = (min, max) => 
      Math.floor(Math.random() * (max-min) ) + min
    const id = String.fromCharCode(
      randomInt(97, 123),
      randomInt(97, 123),
      randomInt(97, 123),
      randomInt(48, 58),
      randomInt(48, 58),
      randomInt(48, 58)
    )
    return duplicateID(id) ? randomID(id) : id
  }

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"].toLowerCase() === name
  );
};

// find using job just like above with name
const findUserByJob = (job) => {
  return users["users_list"].filter(
    (user) => user["job"].toLowerCase() === job
  );
};

// find using job and name just like above with name
const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => (user["name"].toLowerCase() === name && user["job"].toLowerCase() === job)
  );
};

// added in the name/job query here
app.get("/users", (req, res) => {
  const name = req.query.name
  const job = req.query.job

  if (name && job) { // if name and job, finds ppl who match both
    let result = findUserByNameAndJob(name, job)
    result = { users_list: result };
    res.send(result)
  } else if (name) { // if only name is given
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result)
  } else if (job) { // if only job is given
    let result = findUserByJob(job);
    result = { users_list: result };
    res.send(result)
  } else { // if name and job, finds ppl who match both
    res.send(users)
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params.id; //or req.params.id
  let result = findUserById(id);
  if (result) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  user.id = randomID() // add a random user ID
  console.log(user.id)
  users["users_list"].push(user);
  console.log(user)
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const user = addUser(userToAdd);
  console.log(user)
  res.status(201).json(user);
});

// takes in an id and deletes that user from the list
const deleteUser = (id) => {

  users["users_list"] = users["users_list"].filter((user) => user.id !== id)
}

app.delete("/users/:id", (req, res) => {
  const id = req.params.id
  const user = deleteUser(id)
  if (!user) {
    return res.status(404).json({ message: 'Resource not found' })
  } else {
    res.status(204).json({ message: `User ${id} deleted successfully` })
  }
})