const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucfjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("portfolio");
        const projectsCollection = database.collection("projects");
        const blogsCollection = database.collection("blogs");

        app.get('/projects', async (req, res) => {
            const cursor = projectsCollection.find({});
            const projects = await cursor.toArray();
            if(projects){
                res.json(projects)
            }
            if(!projects){
                res.status(404)
            }
        })

        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            if(blogs){
                res.json(blogs)
            }
            if(!blogs){
                res.status(404)
            }
        })

        app.post('/project', async (req, res) => {
            const project = req.body;
            const result = await projectsCollection.insertOne(project);
            res.send(result);
        });

        app.post('/blog', async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
            res.send(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Connect to the server port!!!")
})

app.listen(port, () => {
    console.log('listening on port', port);
});