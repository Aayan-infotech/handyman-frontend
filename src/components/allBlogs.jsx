import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import { GoArrowRight } from "react-icons/go";
import Loader from "../Loader";
import Grid from "@mui/material/Grid";
import Container from "react-bootstrap/Container";
export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/blog/getAll")
      .then((response) => {
        console.log("Blogs response:", response.data);
        setBlogs(response.data.blog);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, []);

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
        <Container fluid>
          <Link to="/" className="py-1">
            <img src={logo} alt="logo" />
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="px-3 pt-2 p-lg-0"
          >
            <Nav className="me-auto d-flex flex-column flex-lg-row gap-2 gap-lg-5 ">
              <Link to="/about" style={{ fontWeight: "350" }}>
                About Us
              </Link>
              <Link to="/contact-us" style={{ fontWeight: "350" }}>
                Contact Us
              </Link>
            </Nav>

            <Nav className="mb-4">
              <Link to="/welcome">
                <Button variant="contained" color="success">
                  Get Started <GoArrowRight className="fs-4 ms-1" />
                </Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-5">
        <Container>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <h2>
              All <span style={{ color: "#1976D2" }}>Blogs</span>
            </h2>
          </Grid>
          <Grid container spacing={4}>
            {blogs?.map((blog) => (
              <Grid item xs={12} sm={6} md={3} key={blog.id}>
                <Card sx={{ maxWidth: 400 }}>
                  <CardActionArea
                    component={Link}
                    to={`/blog-detail/${blog._id}`}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={blog.image}
                      alt={blog.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {blog.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        mt={1}
                      >
                        {blog.date}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
}
