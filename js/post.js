import { BACKEND_URL } from './config.js';
import { Post } from './class/Post.js';

import { Posts } from './class/Posts.js'
import { User } from './class/User.js'


const user = new User()
const posts = new Posts()


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    fetch(`${BACKEND_URL}/post/${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const post = new Post(
                data.id,
                data.title,
                data.message,
                data.image_name,
                data.date,
                data.author,
                data.comments
            );
            displayPostDetails(post);
        })
        .catch(error => {
            console.error('Failed to fetch post:', error);
            displayError(error);
        });
});

/* display Post Content */

function displayPostDetails(post) {
    const postDetailDiv = document.getElementById('postDetail');
    postDetailDiv.innerHTML = ''; 

    const title = document.createElement('h1');
    title.textContent = post.title;
    postDetailDiv.appendChild(title);

    if (post.image) {
        const image = document.createElement('img');
        image.src = `${BACKEND_URL}/images/${post.image}`;
        image.alt = 'Post Image';
        image.style.width = '100%'; 
        postDetailDiv.appendChild(image);
    }

    const message = document.createElement('p');
    message.textContent = post.message;
    postDetailDiv.appendChild(message);

    const author = document.createElement('p');
    author.textContent = post.author ? `Posted by ${post.author}` : "Author unknown";
    postDetailDiv.appendChild(author);

    if (user.isLoggedIn) {
        renderCommentForm(postDetailDiv, post);
        render_post_link(postDetailDiv, post);
    }

    displayComments(post.comments, postDetailDiv);
}

/* Display Comment Form */
function renderCommentForm(container, post) {
    const form = document.createElement('form');
    form.className = 'comment-form';

    const textarea = document.createElement('textarea');
    textarea.className = 'comment-form-control';
    textarea.placeholder = 'Add Your Reply Here...';
    form.appendChild(textarea);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary';
    button.textContent = 'Submit Comment';
    button.onclick = () => submitComment(post.id, textarea.value);
    form.appendChild(button);

    button.onclick = async () => {
        try {
            const updatedComments = await submitComment(post.id, textarea.value);
            if (updatedComments) {
                displayComments(updatedComments, document.getElementById('postDetail')); 
                textarea.value = ''; 
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };
    form.appendChild(button);
    container.appendChild(form);
}

/* Submit Comment Functionalities */
function submitComment(postId, comment) {
    const textarea = document.querySelector('.comment-form-control'); 

    if (!comment.trim()) {
        console.error('Comment cannot be empty.');
        return Promise.reject('Comment cannot be empty.');
    }

    const data = JSON.stringify({
        comment: comment,
        account_id: user.id,
        post_id: postId
    });

    return fetch(`${BACKEND_URL}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit comment');
        }
        return response.json();
    })
    .then(commentData => {
        textarea.value = ''; 
        return fetchUpdatedComments(postId); 
    })
    .catch(error => {
        console.error('Error submitting comment:', error);
        throw error; 
    });
}

/* Fetch Updated Comments */
function fetchUpdatedComments(postId) {
    return fetch(`${BACKEND_URL}/post/${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch updated comments');
            }
            return response.json();
        })
        .then(data => data.comments)
        .catch(error => {
            console.error('Error fetching updated comments:', error);
            throw error;
        });
}


/* Add New Comment */
function addNewComment(comment, commentsList) {
    if (!commentsList) {
        const container = document.getElementById('postDetail');
        displayComments([comment], container); 
    } else {
        const commentItem = document.createElement('li');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <p class="comment-text">${comment.comment_text}</p>
            <p class="comment-author">by ${comment.author}</p>
        `;
        commentsList.prepend(commentItem); 
    }
}


/* display Comments */
function displayComments(comments, container) {
    let commentsList = container.querySelector('.comments-list');
    if (!commentsList) {
        const commentsLabel = document.createElement('h2');
        commentsLabel.className = 'comments-label';
        commentsLabel.textContent = 'Answers';
        container.appendChild(commentsLabel);

        commentsList = document.createElement('ul');
        commentsList.className = 'comments-list';
        container.appendChild(commentsList);
    } else {
        commentsList.innerHTML = '';
    }

    comments.forEach(comment => {
        addNewComment(comment, commentsList);
    });

    if (comments.length === 0) {
        const noComments = document.createElement('p');
        noComments.textContent = 'No comments yet.';
        container.appendChild(noComments);
    }
}


/* display delete button */
const render_post_link = (parent_element, post) => {
    const post_a = document.createElement('a');
    post_a.id = 'delete-post-button';
    post_a.style.display = 'none';

    const icon = document.createElement('i');
    icon.className = 'bi bi-trash';

    const text = document.createTextNode(' Delete post');

    post_a.appendChild(icon);
    post_a.appendChild(text);

    post_a.addEventListener('click', async (event) => {
        event.preventDefault();

        const isConfirmed = confirm("Are you sure you want to delete this post?");
        if (!isConfirmed) {
            return; 
        }

        try {
            const removed_id = await posts.removePost(post.id, user.token);
            const article_to_remove = document.querySelector(`[data-key='${removed_id}']`);
            if (article_to_remove) {
                article_to_remove.remove();
            }
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post: ' + error.message);
        }
    });

    if (user.isLoggedIn) {
        post_a.style.display = 'block';
    }

    parent_element.appendChild(post_a);
};

