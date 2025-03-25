import Container from "react-bootstrap/Container";
import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import Toaster from "./Toaster";
import logo from "./assets/logo.png";
import logoWhite from "./assets/logo-white.png";
import underline from "./assets/underline.png";
import { GoArrowRight } from "react-icons/go";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CiSearch } from "react-icons/ci";
import MenuItem from "@mui/material/MenuItem";
import { SlLocationPin } from "react-icons/sl";
import sidepic from "./assets/sidepic.png";
import { Link } from "react-router-dom";
import { PiBagSimpleLight } from "react-icons/pi";
import mobile from "./assets/mobile.png";
import company1 from "./assets/company/company1.png";
import company2 from "./assets/company/company2.png";
import company3 from "./assets/company/company3.png";
import company4 from "./assets/company/company4.png";
import company5 from "./assets/company/company5.png";
import company6 from "./assets/company/company6.png";
import company7 from "./assets/company/company7.png";
import Autocomplete from "react-google-autocomplete";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';

import company8 from "./assets/company/company8.png";
import { LuDot } from "react-icons/lu";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Row, Col, Form } from "react-bootstrap";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { FaFacebook, FaTwitter, FaInstagram ,FaDribbble,FaLinkedin  } from 'react-icons/fa';
import axios from "axios";


function Home() {
  const [age, setAge] = useState("");
  const [businessData, setBusinessData] = useState([]);
  const [recentJob, setRecentJob] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(""); // State to store selected business
  const [address, setAddress] = useState("");
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://3.223.253.106:7777/api/jobpost/business-type-count")
      .then((res) => {
        const limitedData = res?.data?.data?.slice(0, 8) || []; // Ensure only 8 items
        setBusinessData(limitedData);
      });
  }, []);
  const blogs = [
    {
      id: 1,
      title: 'Blog Title 1',
      date: '2025-03-25',
      image: 'https://media.istockphoto.com/id/2152960546/photo/young-woman-using-digital-tablet-at-home.jpg?s=1024x1024&w=is&k=20&c=27V7LRjvBh65_Zv0F5SNnHBh-_HAutLlkX-KXUgUmxk=',
      description: 'This is a short description for Blog 1. It provides a preview of the content.'
    },
    {
      id: 2,
      title: 'Blog Title 2',
      date: '2025-03-24',
      image: 'https://media.istockphoto.com/id/656630294/photo/more-and-more-people-are-following-her-blog-each-day.jpg?s=1024x1024&w=is&k=20&c=bnKqk262BCIEkRvFHKJMhvtSOLZcFCmQObrKoHmTjxM=',
      description: 'This is a short description for Blog 2. It gives an overview of the post\'s topic.'
    },
    {
      id: 3,
      title: 'Blog Title 3',
      date: '2025-03-23',
      image: 'https://media.istockphoto.com/id/656630294/photo/more-and-more-people-are-following-her-blog-each-day.jpg?s=1024x1024&w=is&k=20&c=bnKqk262BCIEkRvFHKJMhvtSOLZcFCmQObrKoHmTjxM=',
      description: 'This is a short description for Blog 3. It gives a sneak peek into the blog content.'
    },
    {
      id: 4,
      title: 'Blog Title 4',
      date: '2025-03-22',
      image: 'https://media.istockphoto.com/id/1683003373/photo/woman-using-digital-tablet.jpg?s=1024x1024&w=is&k=20&c=G9IQtm2vJw1u2Yi6DcECyR18hOiept628VXgkbf1m_A=',
      description: 'This is a short description for Blog 4. A preview of what readers can expect in the blog.'
    }
  ];
  useEffect(() => {
    axios
      .get("http://3.223.253.106:7777/api/jobs/getRecentJobs")
      .then((res) => {
        setRecentJob(res?.data?.data);
      });
  }, []);
  const handleBusinessChange = (event) => {
    setSelectedBusiness(event.target.value); // Update the selected business
  };
  const handleChange = (event) => {
    setAge(event.target.value);
  };


  const handleClickForSignup = () => {
    navigate("/provider/login"); // Navigate to /login route
  };

  const handleClick = () => {
    if (!selectedBusiness || !latitude || !longitude) {
      setToastProps({
        message: "Please enter businesses and location before searching",
        type: "error",
        toastKey: Date.now(),
      });
      return;
    }

    navigate(
      `/search?lat=${latitude}&lng=${longitude}&businessType=${selectedBusiness}`
    );
  };
  return (
    <>
      <div className="top-section">
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
                <Link href="#" style={{ fontWeight: "350" }}>
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
        <Container>
          <div className="row gy-4 pt-5">
            <div className="col-lg-9 position-relative z-1">
              <div className="mw-75">
                <h1>
                  Need Repairs or
                  <br />
                  <span className="highlighted">Expert Help?</span>
                </h1>
                <img src={underline} alt="underline" className="" />
                <br />
                <span className="text-muted">
                  Trade Hunters connects you with top service providers in
                  Austrlia
                  <br />{" "}
                  <span className="highlighted fs-4">fast and easy?</span>
                </span>
              </div>
              <div className="card my-3 border-0">
                <div className="card-body">
                  <div className="">
                    <Box
                      component="form"
                      className="d-flex justify-content-center align-items-end gap-4 flex-column flex-lg-row"
                    >
                      <div className="d-flex justify-content-start justify-content-lg-center align-items-center gap-3 w-100">
                        <CiSearch className="fs-4 mt-3" />

                        <TextField
                          id="standard-basic"
                          label="Businesses"
                          variant="standard"
                          className="w-100"
                          select
                          fullWidth
                          value={selectedBusiness} // Bind the selected value to TextField
                          onChange={handleBusinessChange} // Update state when selection changes
                          SelectProps={{
                            MenuProps: {
                              PaperProps: {
                                style: {
                                  maxHeight: 200, // Limit dropdown height
                                },
                              },
                            },
                          }}
                        >
                          {/* Map over the businessData array to display business names */}
                          {businessData && businessData.length > 0 ? (
                            businessData.map((business, index) => (
                              <MenuItem key={index} value={business.name}>
                                {business.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              No recent jobs available.
                            </MenuItem>
                          )}
                        </TextField>
                      </div>
                      <div className="d-flex justify-content-start justify-content-lg-center align-items-end  gap-3 w-100">
                        <SlLocationPin className="fs-4 mt-3" />
                        <Autocomplete
                          className="form-control address-landing ps-0"
                          apiKey={import.meta.env.VITE_GOOGLE_ADDRESS_KEY}
                          style={{ width: "100%" }}
                          onPlaceSelected={(place) => {
                            const formattedAddress =
                              place?.formatted_address || place?.name;
                            setAddress(formattedAddress);
                            setLatitude(place.geometry.location.lat());
                            setLongitude(place.geometry.location.lng());
                          }}
                          options={{
                            types: ["address"],
                          }}
                          defaultValue={address}
                        />
                      </div>
                      {/* <Button
                        variant="contained"
                        color="success"
                        className="custom-green px-3 py-2 w-100 rounded-0 bg-green-custom"
                      >
                        Search 
                      </Button> */}

                      <Button
                        variant="contained"
                        color="success"
                        className="custom-green px-3 py-2 w-100 rounded-0 bg-green-custom"
                        onClick={handleClick} // Button click triggers the navigation
                      >
                        Search
                      </Button>
                    </Box>
                  </div>
                </div>
              </div>
              <span className="fs-6 text-muted">
                UI Designer, UX Researcher, Android, Admin
              </span>
            </div>
            <div className="col-lg-3 position-relative z-1">
              <img src={sidepic} alt="sidepic" className="w-100 h-100" />
            </div>
          </div>
        </Container>
      </div>
      <div className="container pb-5">
        <div className="category">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-start justify-content-lg-between align-items-lg-end flex-column flex-md-row gap-3">
              <h2 className="mb-0">
                Explore by <span className="highlighted-text">category</span>
              </h2>
              <Link
                to="/job-listing"
                className="text-decoration-none custom-text-success"
              >
                Show all category <GoArrowRight className="fs-4 ms-1" />
              </Link>
            </div>
            <div className="row gy-4 mt-3">
              {businessData.map((item) => (
                <div className="col-lg-3" key={item._id}>
                  <Link to="/welcome" className="h-100">
                    <div className="card rounded-0 h-100">
                      <div className="card-body">
                        <div className="d-flex flex-column gap-4 justify-content-start">
                          <PiBagSimpleLight className="fs-3" />
                          <h6 className="mb-0 fw-normal fs-5">{item?.name}</h6>
                          <a>
                            {/* {item?.count} jobs available{" "} */}
                            {/* <GoArrowRight className="fs-4 ms-1" /> */}
                          </a>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mobile  container">
          <div className="row">
            <div className="col-lg-5 pt-4">
              <div className="py-5">
                <h5 className="">
                  Do you want to <br />
                  secure more work
                </h5>
                <button
                  className="btn btn-mobile py-2 px-4 my-4"
                  onClick={handleClickForSignup} // Button click triggers the navigation
                >
                  Sign Up
                </button>
                <br />
                <b className="text-light ">
                  {/* To trade and check our plans and choose what suits you best */}
                  To Trade Hunters and check our plans and choose what suits you
                  best
                </b>
              </div>
            </div>
            <div className="col-lg-7  ">
              <div className="position-mobile-adjust">
                <img src={mobile} alt="mobile" className="" />
              </div>
            </div>
          </div>
        </div>
        <div className="jobs">
          <div className="d-flex justify-content-start justify-content-lg-between align-items-start flex-column flex-md-row gap-3">
            <h2 className="mb-0">
              Featured <span className="text-primary">Businesses</span>
            </h2>
            <Link
              to="/featured-jobs"
              className="text-decoration-none custom-text-success"
            >
              Show all Bussiness <GoArrowRight className="fs-4 ms-1" />
            </Link>
          </div>
          <div className="row gy-4 mt-4">
            <div className="col-lg-3">
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={company1}
                        alt="company1"
                        className="img-fluid"
                      />
                      <span className="border-full-time">Full Time</span>
                    </div>
                    <b>Lorem Epsum</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>Revolut</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>Madrid, Spain</span>
                    </div>
                    <span className="text-secondary">
                      Revolut is looking for Email Marketing to help team
                      manager like a who will get nothing like we all get
                    </span>
                    <Stack direction="row" spacing={1} className="mt-3">
                      <Chip label="Marketing" className="light-pink" />
                      <Chip label="Design" className="light-green" />
                    </Stack>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={company2}
                        alt="company2"
                        className="img-fluid"
                      />
                      <span className="border-full-time">Full Time</span>
                    </div>
                    <b>Lorem Epsum</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>Dropbox</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>San Fransisco, US</span>
                    </div>
                    <span className="text-secondary">
                      Dropbox is looking for Brand Designer to help the team
                      manager like a who will get nothing like we all get
                    </span>
                    <Stack direction="row" spacing={1} className="mt-3">
                      <Chip label="Design" className="light-green" />
                      <Chip label="Businesses" className="light-blue" />
                    </Stack>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={company3}
                        alt="company2"
                        className="img-fluid"
                      />
                      <span className="border-full-time">Full Time</span>
                    </div>
                    <b>Lorem Epsum</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>Pitch</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>Berlin, Germany</span>
                    </div>
                    <span className="text-secondary">
                      Pitch is looking for Customer Manager to join manager like
                      a who will get nothing like we all get
                    </span>
                    <Stack direction="row" spacing={1} className="mt-3">
                      <Chip label="Marketing" className="light-pink" />
                    </Stack>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={company4}
                        alt="company2"
                        className="img-fluid"
                      />
                      <span className="border-full-time">Full Time</span>
                    </div>
                    <b>Lorem Epsum</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>Blinklist</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>Granada, Spain</span>
                    </div>
                    <span className="text-secondary">
                      Blinkist is looking for Visual Designer to help team
                      manager like a who will get nothing like we all get
                    </span>
                    <Stack direction="row" spacing={1} className="mt-3">
                      <Chip label="Design" className="light-green" />
                    </Stack>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={company5}
                        alt="company2"
                        className="img-fluid"
                      />
                      <span className="border-full-time">Full Time</span>
                    </div>
                    <b>Lorem Epsum</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>Blinklist</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>Granada, Spain</span>
                    </div>
                    <span className="text-secondary">
                      Blinkist is looking for Visual Designer to help team
                      manager like a who will get nothing like we all get
                    </span>
                    <Stack direction="row" spacing={1} className="mt-3">
                      <Chip label="Design" className="light-green" />
                    </Stack>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={company6}
                        alt="company2"
                        className="img-fluid"
                      />
                      <span className="border-full-time">Full Time</span>
                    </div>
                    <b>Lorem Epsum</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>Blinklist</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>Granada, Spain</span>
                    </div>
                    <span className="text-secondary">
                      Blinkist is looking for Visual Designer to help team
                      manager like a who will get nothing like we all get
                    </span>
                    <Stack direction="row" spacing={1} className="mt-3">
                      <Chip label="Design" className="light-green" />
                    </Stack>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={company7}
                        alt="company2"
                        className="img-fluid"
                      />
                      <span className="border-full-time">Full Time</span>
                    </div>
                    <b>Lorem Epsum</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>Blinklist</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>Granada, Spain</span>
                    </div>
                    <span className="text-secondary">
                      Blinkist is looking for Visual Designer to help team
                      manager like a who will get nothing like we all get
                    </span>
                    <Stack direction="row" spacing={1} className="mt-3">
                      <Chip label="Design" className="light-green" />
                    </Stack>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={company8}
                        alt="company2"
                        className="img-fluid"
                      />
                      <span className="border-full-time">Full Time</span>
                    </div>
                    <b>Lorem Epsum</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>Blinklist</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>Granada, Spain</span>
                    </div>
                    <span className="text-secondary">
                      Blinkist is looking for Visual Designer to help team
                      manager like a who will get nothing like we all get
                    </span>
                    <Stack direction="row" spacing={1} className="mt-3">
                      <Chip label="Design" className="light-green" />
                    </Stack>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="latest-job">
        <div className="container position-relative z-1">
          <div className="d-flex justify-content-start justify-content-lg-between align-items-start flex-column flex-md-row mb-4 gap-3">
            <h2 className="mb-0">
              Latest <span className="text-primary"> jobs posted</span>
            </h2>
            <Link
              to="/latest-jobs"
              className="text-decoration-none custom-text-success"
            >
              Show all jobs <GoArrowRight className="fs-4 ms-1" />
            </Link>
          </div>
          <div className="row gy-4 ">
            {recentJob.map((item) => (
              <div className="col-lg-6" key={item._id}>
                <div className="card border-0 rounded-0 px-4 py-2">
                  <div className="card-body">
                    <div className="d-flex flex-row gap-4 align-items-start">
                      <div className="d-flex flex-column gap-2 justify-content-start">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{item?.title}</h6>
                        </div>

                        <div className="d-flex justify-content-start align-items-center flex-row  flex-wrap">
                          <span className="text-muted">{item?.user?.name}</span>
                          <span className="text-muted">
                            {item?.jobLocation?.jobAddressLine}
                          </span>
                        </div>
                        <Stack
                          direction="row"
                          className="flex-wrap gap-2 justify-content-start align-items-start"
                        >
                          {item.businessType.map((text, index) => (
                            <>
                              <Chip
                                label={text}
                                className=" green-line"
                                key={index}
                              />
                            </>
                          ))}
                        </Stack>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



{/* Blogs Section */}

<Container>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Our Blogs</Typography>
        <Button component={Link} to="/all-blogs" variant="contained" color="primary">Show All Blogs</Button>
      </Grid>
      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={3} key={blog.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea component={Link} to={`/blog-detail/${blog.id}`}>
                <CardMedia
                  component="img"
                  height="140"
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
                  <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                    {blog.date}
                  </Typography>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <FaFacebook size={20} color="#1877F2" />
                    <FaTwitter size={20} color="#1DA1F2" />
                    <FaInstagram size={20} color="#E4405F" />
                    <FaDribbble size={20} color="#EA4C89" />
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>



      <footer className="footer text-light">
        <Container>
          <Row>
            {/* Left Section: Logo and Description */}
            <Col md={4} className="mb-4">
              <img src={logoWhite} alt="logo" />
              <p className="fw-normal mt-3">
                Great platfrom for connecting service Hunters to Service
                providers in Australia
              </p>
            </Col>

            {/* Center Section: Links */}
            <Col md={4} className="mb-4">
              <Row>
                <Col>
                  <h6 className="">About</h6>
                  <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                    {/* <li>
                      <a href="#companies" className="text-light">
                        Companies
                      </a>
                    </li> */}
                    {/* <li>
                      <a href="#pricing" className="text-light">
                        Pricing
                      </a>
                    </li> */}
                       <li>
                      <a href="terms" className="text-light">
                        Blogs
                      </a>
                    </li>
                    <li>
                      <a href="terms" className="text-light">
                        Terms
                      </a>
                    </li>
                    {/* <li>
                      <a href="#advice" className="text-light">
                        Advice
                      </a>
                    </li> */}
                    <li>
                      <a href="privacy" className="text-light">
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </Col>
                <Col>
                  <h6>Resources</h6>
                  <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                    <li>
                      <a href="#help-docs" className="text-light">
                        Help Docs
                      </a>
                    </li>
                    <li>
                      <a href="#guide" className="text-light">
                        Guide
                      </a>
                    </li>
                    <li>
                      <a href="#updates" className="text-light">
                        Updates
                      </a>
                    </li>
                    <li>
                      <a href="/contact-us" className="text-light">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>

          <hr />
          <Row className="mt-4">
            <Col lg={6}>
              <p className="text-start">
                2025 @ TradeHunter. All rights reserved.
              </p>
            </Col>
            <Col lg={6}>
              <div className="social-icons d-flex justify-content-center justify-content-lg-end gap-4 mb-3">
                <a href="#facebook" className="text-light bg-dark">
                  <FaFacebook size={16} />
                </a>
                <a href="#dribble" className="text-light">
                  <FaDribbble size={16} />
                </a>
                <a href="#instagram" className="text-light">
                  <FaInstagram size={16} />
                </a>
                <a href="#twitter" className="text-light">
                  <FaTwitter size={16} />
                </a>
                <a href="#linkedin" className="text-light">
                  <FaLinkedin size={16} />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}

export default Home;
