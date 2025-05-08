import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../components/axiosInstance";
import { getAddress } from "../Slices/addressSlice";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import FormGroup from "@mui/material/FormGroup";
import Pagination from "react-bootstrap/Pagination";
import { getHunterUser } from "../Slices/userSlice";
import FormControlLabel from "@mui/material/FormControlLabel";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import Tooltip from "@mui/material/Tooltip";

import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import Toaster from "../Toaster";
import { GrMapLocation } from "react-icons/gr";
import NoData from "../assets/no_data_found.gif";
import Table from "react-bootstrap/Table";
import FormControl from "@mui/material/FormControl";

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

export default function ServiceProvider() {
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState([]);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [providerRadius, setProviderRadius] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const radiusOptions = ["10", "20", "40", "80", "160"];
  const queryParams = new URLSearchParams(location.search);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("page")) || 1
  );
  const navigate = useNavigate();
  const token = localStorage.getItem("hunterToken");
  const handleChange = (event) => {
    setBusinessType(event.target.value);
  };
  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  useEffect(() => {
    handleGetData();
    if (latitude !== null && longitude !== null) {
      handleAllData();
    }
  }, [latitude, longitude]);

  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getHunterUser());
      if (response?.payload?.status === 200) {
        setLongitude(
          response?.payload?.data?.address?.location?.coordinates[0]
        );
        setLatitude(response?.payload?.data?.address?.location?.coordinates[1]);
        setRadius(response?.payload?.data?.address?.radius || []);
        setLoading(false);

        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
      }
    } catch (error) {
      setToastProps({
        message: error?.response?.data?.error || error.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const handleAllData = useCallback(async () => {
    if (!latitude || !longitude) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/hunter/getNearbyServiceProviders?search=${search}&page=${currentPage}`,
        {
          latitude: latitude,
          longitude: longitude,
          page: currentPage,
          radius,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setData(response?.data?.data || []);
        setFilteredData(response?.data?.data || []);
        setTotalPages(response.data.pagination.totalPage);
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
      }
    } catch (error) {
      setToastProps({
        message: error?.response?.data?.error || error.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, currentPage, radius, search]);

  const handlePageChange = useCallback(
    (page) => {
      queryParams.set("page", page.toString());
      navigate(`?${queryParams.toString()}`);
      setCurrentPage(page);
    },
    [queryParams, navigate]
  );

  useEffect(() => {
    if (latitude && longitude) {
      handleAllData();
    }
  }, [latitude, longitude, currentPage]);

  useEffect(() => {
    let filtered = data;

    if (businessType.length > 0) {
      filtered = filtered.filter((provider) =>
        provider.businessType?.some((type) => businessType.includes(type))
      );
    }

    if (providerRadius && providerRadius.length > 0) {
      const selectedRadius = parseInt(providerRadius.replace(" km", "") * 1000);
      filtered = filtered.filter(
        (provider) => provider.distance <= selectedRadius // Convert meters to km before comparison
      );
    }

    setFilteredData(filtered);
  }, [businessType, providerRadius, currentPage]);

  const filterAddressPatterns = (address) => {
    if (!address) return address;

    const pattern = /^.*?,\s*/;

    return address.replace(pattern, "").trim();
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          {/* <Link to="/support/chat/1">
            <Tooltip title="Message" placement="left-start">
              <div className="admin-message">
                <MdOutlineSupportAgent />
              </div>
            </Tooltip>
          </Link> */}
          <Link to="/message">
            <Tooltip title="Message" placement="left-start">
              <div className="message">
                <MdMessage />
              </div>
            </Tooltip>
          </Link>
          <div className="bg-second py-3">
            <div className="container">
              <div className="row gy-4">
                <div className="col-lg-12">
                  <div className="d-flex justify-content-lg-between flex-column flex-lg-row gap-4">
                    <div className="position-relative icon">
                      <Form
                        className="d-flex flex-row gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAllData();
                        }}
                      >
                        <IoIosSearch className="mt-1" />
                        <Form.Control
                          placeholder="search for Address"
                          className="search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-success">
                          Search
                        </button>
                      </Form>
                    </div>
                    <div className="d-flex w-100 justify-content-end flex-row gap-2">
                      <FormControl className="sort-input w-100">
                        <InputLabel id="radius-select-label">
                          Select Provider Radius
                        </InputLabel>
                        <Select
                          labelId="radius-select-label"
                          id="radius-select"
                          value={providerRadius}
                          onChange={() => {}} // disable default onChange
                          input={
                            <OutlinedInput label="Select Provider Radius" />
                          }
                          renderValue={(selected) =>
                            selected || "Select radius"
                          }
                          MenuProps={MenuProps}
                        >
                          {radiusOptions.map((option, index) => (
                            <MenuItem
                              key={index}
                              value={`${option} km`}
                              onClick={() =>
                                setProviderRadius(
                                  providerRadius === `${option} km`
                                    ? ""
                                    : `${option} km`
                                )
                              }
                            >
                              <Checkbox
                                checked={providerRadius === `${option} km`}
                              />
                              <ListItemText primary={`${option} km`} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl className="sort-input w-100">
                        <InputLabel id="radius-select-label">
                          Select BusinessType
                        </InputLabel>
                        <Select
                          labelId="business-type-select-label"
                          id="business-type-select"
                          multiple
                          value={businessType}
                          onChange={handleChange}
                          input={<OutlinedInput label="Select Business Type" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                          placeholder="Select Business Type"
                        >
                          {Array.from(
                            new Set(
                              data.flatMap((provider) => provider.businessType)
                            )
                          ).map((type, index) => (
                            <MenuItem key={index} value={type}>
                              <Checkbox checked={businessType.includes(type)} />
                              <ListItemText primary={type} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    {/* {data?.map((provider, index) => (
                          <div key={provider._id} className="col-lg-12">
                            <FormControlLabel
                              control={<Checkbox />}
                              label={provider?.businessType}
                            />
                          </div>
                        ))} */}
                  </div>
                </div>
                <div className="col-lg-12">
                  {filteredData.length === 0 ? (
                    <div className="d-flex justify-content-center flex-column gap-1 align-items-center">
                      <img src={NoData} alt="noData" className="w-nodata" />
                    </div>
                  ) : (
                    <div className=" management">
                      {/* {data?.map((provider, index) => (
                    <div key={provider._id} className="col-lg-12">
                      <Link to={`/service-profile/${provider._id}`}>
                        <div className="card border-0 rounded-3 px-4">
                          <div className="card-body">
                            <div className="row gy-4 gx-1 align-items-center">
                              <div className="col-lg-4">
                                <div className="d-flex flex-row gap-3 align-items-center">
                                  <div className="d-flex flex-column align-items-start gap-1">
                                    <h3 className="mb-0">
                                      {provider.businessName}
                                    </h3>
                                    <h6>
                                      {provider.businessType?.[0] ||
                                        "No Category"}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-8">
                                <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-lg-center">
                                  <div className="d-flex flex-row gap-2 align-items-center">
                                    <GrMapLocation />
                                    <h5 className="mb-0 d-flex flex-row gap-2 align-items-center">
                                      <span>
                                        {(provider.distance / 1000).toFixed(2)}{" "}
                                      </span>
                                      <span>km</span>
                                    </h5>
                                  </div>
                                  <div className="d-flex flex-row gap-2 align-items-center">
                                    <PiBag />
                                    <h5 className="mb-0">
                                      {provider.address.addressLine}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))} */}
                      <div className="card shadow border-0 rounded-5 p-lg-3">
                        <div className="card-body">
                          <Table responsive hover>
                            <thead className="">
                              <tr className="">
                                <th className="green-card-important py-3 text-center">
                                  #
                                </th>
                                <th className="green-card-important py-3 text-center">
                                  Name
                                </th>
                                <th className="green-card-important py-3 text-center">
                                  BusinessType
                                </th>
                                <th className="green-card-important py-3 text-center">
                                  Distance(km)
                                </th>
                                <th className="green-card-important py-3 text-center">
                                  Address
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData?.map((provider, index) => (
                                <tr key={provider._id} className="text-center">
                                  <td>{index + 1}</td>
                                  <td>
                                    {" "}
                                    <Link
                                      to={`/service-profile/${provider._id}`}
                                      className="text-dark"
                                    >
                                      {provider.businessName}
                                    </Link>
                                  </td>
                                  <td>
                                    <tr
                                      className={`text-start flex-wrap ${
                                        provider.businessType.length === 1
                                          ? ""
                                          : "d-flex"
                                      }`}
                                    >
                                      {Array.isArray(provider?.businessType) &&
                                      provider.businessType.length > 0
                                        ? provider.businessType.map(
                                            (type, index) => (
                                              <>
                                                <td
                                                  key={index}
                                                >{`"${type}"`}</td>
                                              </>
                                            )
                                          )
                                        : "No Category"}
                                    </tr>
                                  </td>
                                  <td>
                                    {(provider.distance / 1000).toFixed(2)}
                                  </td>
                                  <td>
                                    {filterAddressPatterns(
                                      provider.address.addressLine
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <Pagination className="justify-content-center pagination-custom">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </Pagination.Item>
                            ))}
                          </Pagination>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Toaster
            message={toastProps.message}
            type={toastProps.type}
            toastKey={toastProps.toastKey}
          />
        </>
      )}
    </>
  );
}
