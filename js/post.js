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
        render_post_link(postDetailDiv, post);
    }

    displayComments(post.comments, postDetailDiv);
}

function displayComments(comments, container) {
    if (comments && comments.length > 0) {
        const commentsLabel = document.createElement('h2');
        commentsLabel.textContent = 'Comments';
        container.appendChild(commentsLabel);

        const commentsList = document.createElement('ul');
        comments.forEach(comment => {
            const commentItem = document.createElement('li');
            commentItem.textContent = `${comment.comment_text} - by ${comment.author}`;
            commentsList.appendChild(commentItem);
        });
        container.appendChild(commentsList);
    } else {
        const noComments = document.createElement('p');
        noComments.textContent = 'No comments yet.';
        container.appendChild(noComments);
    }
}

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
