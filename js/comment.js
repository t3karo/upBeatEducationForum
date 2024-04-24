// const render_comment_field = (parent_element, post) => {
//     const comment_textarea = parent_element.appendChild(document.createElement('textarea'));
//     comment_textarea.addEventListener('keypress', (event) => {
//         if (event.key === "Enter") {
//             event.preventDefault();
//             const comment_text = comment_textarea.value;

//             console.log("Posting comment for user ID:", user.id, " and post ID:", post.id);  // Debugging output

//             if (!user.id || !post.id) {
//                 alert("Missing user or post ID!");
//                 return;  // Prevent further execution if IDs are missing
//             }

//             const data = JSON.stringify({
//                 comment: comment_text,
//                 account_id: user.id,
//                 post_id: post.id
//             });

//             posts.addComment(data).then(count => {
//                 comment_textarea.value = '';
//                 document.querySelector('p#comment' + post.id).innerHTML = "Comments " + count;
//             }).catch(error => {
//                 alert(error);
//             });
//         }
//     });
// };
