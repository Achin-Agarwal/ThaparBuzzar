import mongoose from "mongoose";
 const announcementSchema = new mongoose.Schema({
    // ticketId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true
    // },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    rateBifercation: {
        type: String,
        required: false,
        trim: true
    },
    images:{
        paymentConfirmation:[
            {
                type: String
            }
        ],
        productImages:[
            {
                type: String
            }
        ]
    },
    days:{// no of days a announcement will stay vails startinf from the approved date
        type: Number,
        required: false,
    },
    isApproved:{
        type: Boolean,
        default: false
    },
    isDisapproved :{
        type: Boolean,
        default: false
    },approvedOn:{
        type: Date,
        required: false
    },
    expiresin:{
        type: Date,
        required: false
    },
    amount:{
        type: Number,
        required: false
    }
    
});
const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;

