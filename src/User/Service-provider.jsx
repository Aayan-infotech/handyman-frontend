import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getAddress } from "../Slices/addressSlice";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
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
      const response = await axios.get(
        "http://3.223.253.106:7777/api/address/addresses-by-id",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response?.data?.[0]?.location?.coordinates);
      if (response.status === 200) {
        setLongitude(response?.data?.[0]?.location?.coordinates[0]);
        setLatitude(response?.data?.[0]?.location?.coordinates[1]);
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

  const handleAllData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://3.223.253.106:7777/api/hunter/getNearbyServiceProviders",
        { latitude, longitude }
      );
      console.log(response);
      if (response.status === 200) {
        setLoading(false);
        setData(response?.data?.data || []);
        setSearch("");
        setProviderRadius([]);
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
      }
      if (response.data.data.length === 0) {
        setToastProps({
          message: "No service provider available in your area",
          type: "info",
          toastKey: Date.now(),
        });
        setLoading(false);
        setData([]);
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
  };

  useEffect(() => {
    let filtered = data;

    if (businessType.length > 0) {
      filtered = filtered.filter((provider) =>
        provider.businessType?.some((type) => businessType.includes(type))
      );
    }

    // if (search) {
    //   filtered = filtered.filter((provider) =>
    //     provider.businessName?.toLowerCase().includes(search.toLowerCase())
    //   );
    // }

    if (search) {
      filtered = filtered.filter((provider) =>
        provider.address?.addressLine
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [search, businessType, data]);

  console.log(data);

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <Link to="/support/chat/1">
            <div className="admin-message">
              <MdOutlineSupportAgent />
            </div>
          </Link>
          <div className="message">
            <Link to="/message">
              <MdMessage />
            </Link>
          </div>
          <div className="bg-second py-3">
            <div className="container">
              <div className="row gy-4">
                <div className="col-lg-12">
                  <div className="d-flex justify-content-lg-between flex-column flex-lg-row gap-4">
                    <div className="position-relative icon">
                      <IoIosSearch className="mt-1" />
                      <Form.Control
                        placeholder="search for Address"
                        className="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
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
                          onChange={(event) => {
                            setProviderRadius(event.target.value); // Single value, not an array
                          }}
                          input={
                            <OutlinedInput label="Select Provider Radius" />
                          }
                          renderValue={(selected) => selected} // Remove .join(", ") since it's now a single string
                          MenuProps={MenuProps}
                          placeholder="Select Provider Radius"
                        >
                          {Array.from(
                            new Set(
                              data.flatMap(
                                (provider) => provider.address.radius
                              )
                            )
                          )
                            .map((type) => `${type / 1000} km`) // Ensure value format matches
                            .map((formattedType, index) => (
                              <MenuItem key={index} value={formattedType}>
                                <Checkbox
                                  checked={providerRadius === formattedType}
                                />{" "}
                                {/* Adjusted for single selection */}
                                <ListItemText primary={formattedType} />
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
                  {data.length === 0 ? (
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
                                  <td
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
                                              <div key={index}>
                                                {type}
                                                {" ,  "}
                                              </div>
                                            </>
                                          )
                                        )
                                      : "No Category"}
                                  </td>

                                  <td>
                                    {(provider.distance / 1000).toFixed(2)}
                                  </td>
                                  <td>{provider.address.addressLine}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
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
