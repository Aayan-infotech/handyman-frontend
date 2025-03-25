// import { useParams, Link } from 'react-router-dom';

// const BlogDetail = () => {
//   const { id } = useParams(); // Get blog ID from URL params

//   // Sample blog data (replace this with actual fetched data later)
//   const blogData = {
//     id: id,
//     title: `Blog Title ${id}`,
//     date: `2025-03-${25 - id}`,
//     thumbnail: `path-to-thumbnail${id}.jpg`,
//     content: `This is the full content for Blog ${id}. It contains detailed information about the topic.`,
//     relatedBlogs: [
//       { id: 1, title: 'Blog Title 1' },
//       { id: 2, title: 'Blog Title 2' },
//       { id: 3, title: 'Blog Title 3' }
//     ]
//   };

//   return (
//     <div className="blog-detail-container">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-8">
//             <div className="blog-detail-card">
//               <h2>{blogData.title}</h2>
//               <p className="text-muted">{blogData.date}</p>
//               <img src={blogData.thumbnail} alt="Blog Thumbnail" className="img-fluid mt-3" />
//               <p className="mt-4">{blogData.content}</p>
//             </div>
//           </div>
//           <div className="col-lg-4">
//             <h4>Related Blogs</h4>
//             <ul className="related-blogs">
//               {blogData.relatedBlogs.map((relatedBlog) => (
//                 <li key={relatedBlog.id}>
//                   <Link to={`/blog-detail/${relatedBlog.id}`}>{relatedBlog.title}</Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetail;




// import React from 'react';
// import { useParams } from 'react-router-dom';

// const BlogDetail = () => {
//   // Get the dynamic id from the URL
//   const { id } = useParams();

//   // You can use the `id` to fetch specific blog data from an API or display static data
//   // Example static blog content:
//   const blogData = {
//     1: {
//       title: 'Blog Title 1',
//       date: '2025-03-25',
//       content: 'This is the full content for Blog 1. More detailed information here.',
//       thumbnail: 'path-to-thumbnail1.jpg',
//     },
//     2: {
//       title: 'Blog Title 2',
//       date: '2025-03-24',
//       content: 'This is the full content for Blog 2. More detailed information here.',
//       thumbnail: 'path-to-thumbnail2.jpg',
//     },
//     3: {
//       title: 'Blog Title 3',
//       date: '2025-03-23',
//       content: 'This is the full content for Blog 3. More detailed information here.',
//       thumbnail: 'path-to-thumbnail3.jpg',
//     },
//     // Add more blog data here as needed
//   };

//   // Get the blog details using the ID
//   const blog = blogData[id];

//   if (!blog) {
//     return <div>Blog not found!</div>;
//   }

//   return (
//     <div className="container mt-5">
//       <div className="row">
//         <div className="col-lg-8">
//           <div className="blog-detail-card">
//             <h2>{blog.title}</h2>
//             <p className="text-muted">{blog.date}</p>
//             <img src={blog.thumbnail} alt="Blog Thumbnail" className="img-fluid mt-3" />
//             <p className="mt-4">
//               {blog.content}
//             </p>
//           </div>
//         </div>
//         <div className="col-lg-4">
//           <h4>Related Blogs</h4>
//           <ul>
//             {/* Use similar logic to list related blogs */}
//             <li><a href={`/blog-detail/1`}>Related Blog 1</a></li>
//             <li><a href={`/blog-detail/2`}>Related Blog 2</a></li>
//             <li><a href={`/blog-detail/3`}>Related Blog 3</a></li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetail;
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from './Navbar';

export default function BlogDetail () {
  const { id } = useParams();  // Get the dynamic id from the URL

  const blogData = {
    1: {
      title: 'Blog Title 1',
      content: 'This is the full content for Blog 1.',
      date: '2025-03-25',
      thumbnail: 'path-to-thumbnail1.jpg',
    },
    2: {
      title: 'Blog Title 2',
      content: 'This is the full content for Blog 2.',
      date: '2025-03-24',
      thumbnail: 'path-to-thumbnail2.jpg',
    },
    // Add more blog data as needed...
  };

  // Fetch the blog based on the id
  const blog = blogData[id];

  if (!blog) {
    return <div>Blog not found!</div>;
  }

  return (
    <>
    <Header/>
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="blog-detail-card">
            <h2>{blog.title}</h2>
            <p className="text-muted">{blog.date}</p>
            <img src={blog.thumbnail} alt="Blog Thumbnail" className="img-fluid mt-3" />
            <p className="mt-4">{blog.content}</p>
          </div>
        </div>
        <div className="col-lg-4">
          <h4>Related Blogs</h4>
          <ul>
            <li><a href={`/blog-detail/1`}>Related Blog 1</a></li>
            <li><a href={`/blog-detail/2`}>Related Blog 2</a></li>
          </ul>
        </div>
      </div>
      
    </div>
    </>
  );
};

// export default BlogDetail;
