require('dotenv').config({ override: true });
const express = require("express");
const mongoose = require("mongoose");

// mongodb connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL, err=>{
    if(err){
        console.log(err);
    }else{
        console.log("Datatbase connected");
    }
});

// sshema and model
const productSchema = {
    title: String,
    model: String,
    description: String,
    price: Number
};
const Product = mongoose.model("Product", productSchema);

// Initilizing express app
const app = express();
app.use(express.urlencoded({extended: true}));

// ######################################## Dealing all records ######################################################
app.route("/products")
.get((req, res)=>{
    Product.find((err, results)=>{
        if(err){
            res.send(err)
        }else{
            res.send(results);
        }
    });
})
.post((req, res)=>{
    const newProduct = new Product({
        title: req.body.title,
        model: req.body.model,
        description: req.body.description,
        price: req.body.price
    });
    newProduct.save(err=>{
        if(err){
            res.send(err)
        }else{
            res.send("Record added successfully");
        }
    });
})
.delete((req, res)=>{
    Product.deleteMany((err)=>{
        if(err){
            res.send(err)
        }else{
            res.send("All records deleted");
        }
    });
});

// ######################################## Dealing specific record ######################################################

app.route("/product/:model")
.get((req, res)=>{
    // console.log(req.params.title);
    Product.findOne({model: req.params.model}, (err, result)=>{
        if(result){
            res.send(result);
        }else{
            res.send("No product with  " + req.params.title +" title found");
        }
    });
})
.put((req, res)=>{
    Product.updateMany({model: req.params.model}, req.body, err=>{
        if(err){
            res.send(err);
        }else{
            res.send("Record updated successfully using put method");
        }
    });
})
.patch((req, res)=>{
    Product.updateMany({model: req.params.model}, {$set: req.body}, err=>{
        if(err){
            res.send(err);
        }else{
            res.send("Record updated successfully using patch method");
        }
    });
})
.delete((req, res)=>{
    Product.deleteOne({model: req.params.model}, (err)=>{
        if(err){
            res.send(err)
        }else{
            res.send("One record deleted");
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Server started on port: ${port}`));