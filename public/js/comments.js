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
        console.log(comment)
        let commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        let commentContent = document.createElement('p');
        commentContent.innerText = comment.content;

        let commentTime = document.createElement('p');
        commentTime.innerText = comment.time;

        commentDiv.appendChild(commentContent);
        commentDiv.appendChild(commentTime);

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

        // push to llist
        comments.push(comment);

        // empty the comment box
        document.getElementById('comment').value = '';

        // re rendere comments
        await renderComments();
    });
}

setTimeout(async () => {
    setupCommentForm();
    await loadComments();
    await renderComments();
}, 1); 