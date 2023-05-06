import { comments } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import helpers from '../helpers.js';
import users from './users.js';
import bars from './bars.js';

export async function getAllComments() {
    const commentCollection = await comments();
    const commentList = await commentCollection.find({}).toArray();
    return commentList;
};

export async function getCommentsByBarID(barId) {
    barId = helpers.checkId(barId, 'barId');
    const commentCollection = await comments();
    const commentList = await commentCollection.find({ barId: barId }).toArray();

    if (!commentList) throw `Error: No comments found for bar with id ${barId}`;
    return commentList;
};

export async function getCommentById(id) {
    id = helpers.checkId(id, 'commentID');
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (!comment) throw `Error: Comment was not found`;
    return comment;
};

//idk why the curly braces were in the params
//export async function addComment({ barId, userId, time, content }) {
export async function addComment( barId, userId, time, content ) {
    barId = helpers.checkId(barId, 'barId');
    userId = helpers.checkId(userId, 'userId');
    //have to do time validation
    time = time;
    //have to do content validation
    content = content;

    const theBar = await bars.getBarById(barId);
    const theUser = await users.getUserById(userId);
    let newComment = {
        barId: barId,
        userId: userId,
        time: time,
        content: content
    };

    //const


    
    const commentCollection = await comments();
    const newInsertInfo = await commentCollection.insertOne(newComment);
    if (!newInsertInfo.insertedId) throw 'new comment insert failed :(';

    let barCommentArray = theBar.comments;
    if(!barCommentArray) barCommentArray = [];
    if(barCommentArray.length < 1) barCommentArray = [];

    let userCommentArray = theUser.comments;
    if(!userCommentArray) userCommentArray = [];
    if(userCommentArray.length < 1) barCommentArray = [];

    barCommentArray.push(newInsertInfo.insertedId.toString());
    userCommentArray.push(newInsertInfo.insertedId.toString());

    await bars.updateBarPatch(barId,{
        comments: barCommentArray
    });

    await users.updateUserPatch(userId,{
        comments: userCommentArray
    });

    
    return await getCommentById(newInsertInfo.insertedId.toString());
};

export async function removeComment(id) {
    id = helpers.checkId(id, "commentId");
    const commentCollection = await comments();
    const deletionInfo = await commentCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (deletionInfo.lastErrorObject.n === 0) {
        throw [404, `Error: Couldnot delete user with id ${id}`];
    }

    return { ...deletionInfo.value, deleted: true };
};
export async function updateCommentPatch(id, updatedComment) {
    id = helpers.checkId(id, "commentId");
    if (updatedComment.barId) {
        updatedComment.barId = helpers.checkId(
            updatedComment.barId, "commentBarId"
        );
    }
    if (updatedComment.userId) {
        updatedComment.userId = helpers.checkId(
            updatedComment.userId, "commmentUserId"
        );
    }
    //time needs more validation
    if (updatedComment.time) {
        updatedComment.time = time;
    }
    //content needs more validationd
    if (updatedComment.content) {
        updatedComment.content = content;
    }

    const commentCollection = await comments();
    const updateInfo = await commentCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedComment },
        { returnDocument: 'after' }
    );
    if (updateInfo.lastErrorObject.n === 0) {
        throw [
            404, `Error: update failed, could not find comment with id ${id}`
        ];
    }
    return await updateInfo.value;
};