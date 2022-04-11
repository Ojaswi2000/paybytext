const express= require('express');
const {body, validationResult} = require('express-validator'); //imported express-validator
const data = require('./data');

const app= express();

app.listen(3000,()=>{
    console.log("Listening on port 3000");
});

// middleware
app.use(express.json());

//redirect from localhost
app.get('/',(req,res)=>{
    res.redirect('/api/v1/paybytext');
})

// GET request for the entire information
app.get('/api/v1/paybytext',(req,res)=>{
    res.json(data);
})


// handler for GET request for a single id
const handleGetPayByTextByIdentityId=(req,res)=>{
    const {params}=req;
    const {id} = params;
    let httpStatusCode, httpMessageBody;

    for(let i=0;i<data.payByTextItems.length; i++){
        if(data.payByTextItems[i]._id === id){
            res
                .status(200)
                .json({
                    httpStatusCode: "200",
                    httpMessageBody: data.payByTextItems[i]
                });
            return;
        }
        else{
            res
                .status(404)
                .json({
                    httpStatusCode: "404",
                    httpMessageBody: `PAYBYTEXT not found for the given id:${id} `
                })
            return;
        }
    }
}

// handler for DELETE request for a single id
const handleDeletePayByTextById=(req,res)=>{
    try {
        const {params} =req;
        const {id} = params;
        const index= data.payByTextItems.findIndex((element)=>{
            return (element._id === String(id));
        })
        let httpStatusCode,httpMessageBody;
        if(index){
            let del = data.payByTextItems[index];
            data.payByTextItems.splice(index,1); //delete one object 
            res
                .status(200)
                .json({
                    httpStatusCode:200,
                    httpMessageBody: `The deleted item from the dataset is:${del}`
                });
            }
        else{
            res
                .status(404)
                .json({
                    httpStatusCode:404,
                    httpMessageBody: `Id not found !`
                });
        }
    } catch (error) {
        res
            .status(500)
            .json({
                errorCode:500,
                errorMessage: "The request failed due to server error"
            })
    }
    
}

//handler for POST request for a single id
const handleUpsertPayByText=(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {body} = req;
        const {accountName, active, accountNumber,createdOn,issuer,paymentType,
        modifiedOn,merchantId,createdBy,executeFlag,identityId,paymentMethod,
        modifiedBy,_id,walletId} =body; 
    
        const user_id= data.payByTextItems.length+1;
    
        const user= {
          accountName,
          active,
          accountNumber,
          createdOn,
          issuer,
          paymentType,
          modifiedOn,
          merchantId,
          createdBy,
          executeFlag,
          identityId,
          paymentMethod:{
              walletId:user_id
          },
          modifiedBy,
          _id:user_id
        }
        data.payByTextItems.push(user);
        res
            .status(200)
            .json({
                "code":200, 
                "message":"Successfully added user"
            });
    } catch (error) {
        res
            .status(500)
            .json({
                errorCode:500,
                errorMessage:"POST failed due to server error"
            })
    }
    
}

// GET requet for a single id
app.get('/api/v1/paybytext/list/byIdentity/:id', handleGetPayByTextByIdentityId)


//DELETE request for a single id
app.get('/api/v1/paybytext/:id', handleDeletePayByTextById)


//POST request for a single id
app.get('/api/v1/paybytext',
    body(accountNumber).isLength({min:5}),
    body(_id).isAlpha()
,handleUpsertPayByText)

