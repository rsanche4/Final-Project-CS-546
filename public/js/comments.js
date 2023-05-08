// GET /comments/:barId
// POST /comments/:barId { content: string }

async function getCommentsByBarID(id) {
    // fetch
    let response = await fetch(`/comments/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (response.status !== 200) {
        throw await response.json();
    }

    return await response.json();
}

async function addComment(barId, content) {
    // fetch
    let response = await fetch(`/comments/${barId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });
    if (response.status !== 200) {
        throw await response.json();
    }

    return await response.json();
}

// from path: /searchbars/:barid
async function getBarId() {
    return window.location.pathname.split('/')[2];
}

// barID, userID, time, content
let comments = []

async function loadComments() {
    // get barId
    let barId = await getBarId();

    // get comments
    comments = await getCommentsByBarID(barId);
}

async function renderComments() {
    let commentsMount = document.getElementById('comment-mount');

    // render comments
    commentsMount.innerHTML = '';

    // most recent on top
    let sorted = comments.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
    });

    for (let comment of sorted) {
        let commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        const time = new Date(comment.time);


        let commmentUserId = document.createElement('p');
        commmentUserId.innerText = comment.user.firstName + ' ' + comment.user.lastName + " on " + time.toLocaleDateString();

        let commentContent = document.createElement('p');
        commentContent.innerText = comment.content;


        commentDiv.appendChild(commmentUserId);
        commentDiv.appendChild(commentContent);

        commentsMount.appendChild(commentDiv);
    }
}

// comment form called comment-form
const setupCommentForm = () => {
    let commentForm = document.getElementById('comment-form');

    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let content = document.getElementById('comment').value;

        // get barId
        let barId = await getBarId();

        // add comment
        const comment = await addComment(barId, content);


        // empty the comment box
        document.getElementById('comment').value = '';

        comments = []
        await loadComments();
        
        // re rendere comments
        await renderComments();
    });
}

// if the comment is posted by the same user, make the submission form have the content of the users comment, update the button to say “edit” and make it so that when the user clicks edit, it updates the comment instead of adding a new one

setTimeout(async () => {
    setupCommentForm();
    await loadComments();
    await renderComments();
}, 1); 