const mongoose=require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
const faceSchema=new mongoose.Schema({
    neutral:{
        type: SchemaTypes.Double,
        required: true
    },
    happy:{
        type: SchemaTypes.Double,
        required: true
    },

    sad:{
        type: SchemaTypes.Double,
        required: true
    },
    angry:{
        type: SchemaTypes.Double,
        require: true
        
    },
    fearful:{
        type: SchemaTypes.Double,
        require: true
        
    },
    disgusted:{
        type: SchemaTypes.Double,
        require: true
    },
    surprised:{
        type: SchemaTypes.Double,
        reqruired: true
    },

    emotion:{
        type: String,
        reqruired: true
    },
    
})

module.exports=mongoose.model('faces',faceSchema)