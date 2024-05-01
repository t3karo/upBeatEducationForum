import { Posts } from './class/Posts.js'
import { User } from './class/User.js'
import { BACKEND_URL } from './config.js'

const user = new User()
const posts = new Posts()

const posts_div = document.querySelector('div#posts')
const add_new_post_link = document.querySelector('a#add-new-post-link')
const modal_window = document.querySelector('div#modal')
const close_span = document.querySelector('span.close')

/* display add new post link if user is logged in */

if (user.isLoggedIn) {
  add_new_post_link.style.display = "block"
}

/* render post article */
const render_post_article = (post) => {
  const post_article = posts_div.appendChild(document.createElement('article'))
  post_article.setAttribute('data-key',post.id.toString())
  post_article.setAttribute('class','card post-article')

  if (post.image.length > 0) {
    render_post_image(post_article,post)
  }
  render_post_title(post_article,post)
  render_post_by(post_article,post)
  render_post_p(post_article,post)
  render_commentcount(post_article,post)
  if (user.isLoggedIn) render_comment_field(post_article,post)
}

/* render post image */
const render_post_image = (parent_element,post) => {
  const img = parent_element.appendChild(document.createElement('img'))
  img.setAttribute('class','card-img-top post-image')
  img.setAttribute('alt','Post image')
  img.src = BACKEND_URL + '/images/' + post.image
}

/* render post title */
const render_post_title = (parent_element, post) => {
  const postTitle = document.createElement('h3');
  postTitle.className = 'card-title';
  const link = document.createElement('a');
  link.href = `post.html?id=${post.id}`; 
  link.textContent = post.title;
  postTitle.appendChild(link);
  parent_element.appendChild(postTitle);
};

/* render post by */
const render_post_by = (parent_element,post) => {
  const author_p = parent_element.appendChild(document.createElement('p'))
  author_p.innerHTML = `by ${post.author} ${post.formattedDate}`
}

const render_post_p = (parent_element,post) => {
  const post_p = parent_element.appendChild(document.createElement('p'))
  post_p.innerHTML = post.message  
  render_post_span(post_p,post)
}

const render_post_span = (parent_element,post) => {
  const post_span = parent_element.appendChild(document.createElement('span'))
  render_post_link(post_span,post)
}

  /* render post link for delete button */
const render_post_link = (parent_element, post) => {
  const post_a = document.createElement('a');
  post_a.id = 'delete-post-button';
  post_a.style.display = 'none';

  const icon = document.createElement('i');
  icon.className = 'bi bi-trash';

  const text = document.createTextNode(' Delete post');

  post_a.appendChild(icon); 
  post_a.appendChild(text); 

  post_a.addEventListener('click', (event) => {
    event.preventDefault(); 
    posts.removePost(post.id, user.token).then(removed_id => {
      const article_to_remove = document.querySelector(`[data-key='${removed_id}']`);
      if (article_to_remove) {
        posts_div.removeChild(article_to_remove);
      }
    }).catch(error => {
      console.error('Error deleting post:', error);
      alert('Failed to delete post: ' + error.message);
    });
  });

  if (user.isLoggedIn) {
    post_a.style.display = 'block';
  }

  parent_element.appendChild(post_a);
};

/* render comment count */
const render_commentcount = (parent_element,post) => {
  const comment_p = parent_element.appendChild(document.createElement('p'))
  comment_p.setAttribute('id','comment' + post.id)
  comment_p.innerHTML = "Comments " + post.comments
  comment_p.addEventListener('click',()=> {
    render_comments(post)
    modal_window.style.display = 'flex'
  })
}

/* render comments */
const render_comments = (post) => {
  const comments_ul = document.querySelector('ul#comment-list')
  comments_ul.innerHTML = ""
  posts.getComments(post.id).then(comments => {
    comments.forEach(comment => {
      const li = document.createElement('li')
      li.innerHTML = comment.text + ' by ' + comment.author + ' ' + comment.formattedDate
      comments_ul.appendChild(li)
    })
  }).catch(error => {
    alert(error)
  })
}

/* render comment field */
const render_comment_field =(parent_element,post) => {
  const comment_textarea = parent_element.appendChild(document.createElement('textarea'))
  comment_textarea.addEventListener('keypress',(event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      const comment_text = comment_textarea.value

      const data = JSON.stringify({comment: comment_text,account_id:user.id,post_id:post.id})
      posts.addComment(data).then(count => {
        comment_textarea.value = ''
        document.querySelector('p#comment' + post.id).innerHTML = "Comments " + count
      }).catch(error => {
        alert(error)
      })   
    }
  })
}

close_span.addEventListener('click',() => {
  modal_window.style.display = 'none'
})

window.addEventListener('click',(event) => {
  if (event.target === modal_window) {
    modal_window.style.display = 'none'
  }
})

const getPosts = () => {
  posts.getPosts().then(post_objects => {
    posts_div.innerHTML = '';
    if (post_objects.length > 0) {
      post_objects.sort((a, b) => b.id - a.id);
      post_objects.forEach(post_object => {
        render_post_article(post_object);
      });
    } else {
      posts_div.innerHTML = '<p>No posts available.</p>';
    }
  }).catch(error => {
    console.error("Failed to load posts:", error);
    alert("Failed to load posts: " + error);
  });
};

getPosts();
