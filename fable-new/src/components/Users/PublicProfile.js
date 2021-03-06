import { Alert, Avatar, Fab, Stack } from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Paper,
  Divider,
  Button,
  CardActionArea,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Badge } from "@material-ui/core";
import { Chip } from "@material-ui/core";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Edit from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewLibrariesList from "../Libraries/ViewLibrariesList";
import noImage from "../Assets/noimage.jpeg";

/* This component will take care of displaying
    - a user's public profile
    - their works
*/

const useStyles = makeStyles({
  storyLink: {
    textDecoration: "none",
  },
  imageWrapper: {},
  images: {
    margin: 15,
    border: "solid 1px black",
    borderRadius: "50%",
    boxShadow: "2px 2px 2px 2px",
    width: 150,
    height: 150,
  },
  title: {
    border: " 0px #fff",
    width: "auto",
    paddingRight: "100%",
  },
  stack: {
    width: "auto",
    height: "auto",
    paddingRight: "auto",
  },
  media: {
    width: "50%",
    height: "120px",
    height: "auto",
    float: "left",
    margin: "3px",
    padding: "3px",
  },
  cards: {
    width: "500px",
    height: "600px",
    marginLeft: "100%",
    marginRight: "100%",
    border: "3px solid black",
    borderRadius: "5px",
  },
  text: {
    color: "Black",
    justifyContent: "center",
    marginLeft: "34%",
    marginRight: "auto",
    marginTop: "4%",
    fontSize: "35px",
  },
  textstory: {
    color: "Black",
    justifyContent: "center",
    marginLeft: "14%",
    marginRight: "auto",
  },
  text1: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "80%",
    marginRight: "auto",
  },
  text2: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "0%",
    marginRight: "auto",
  },
  text3: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "0%",
    marginRight: "auto",
  },
  box: {
    paddingLeft: "auto",
    marginLeft: "44%",
    marginRight: "100%",
  },
  title: {
    color: "black",
    justifyContent: "center",
    fontSize: "30px",
    paddingLeft: 40,
  },
  title1: {
    color: "black",
    textDecoration: "none",
    fontSize: "20px",
    paddingLeft: 0,

    "&:hover": {
      fontWeight: "bolder",
      textDecoration: "none",
    },
  },

  card1: {
    width: "100%",
    height: "8%",
    marginLeft: "0%",
    paddingLeft: "0%",
    paddingRight: "0%",
    marginRight: "0%",
    paddingBottom: "0%",
    marginBottom: "1%",
    fontSize: "25px",
  },
  // card2: {
  //   width: 600,
  //   marginBottom: "100px",
  //   // paddingLeft:"10%",
  //   paddingBottom: "2%",
  //   height: "2%",
  //   paddingLeft: "2%",
  //   paddingRight: "50%",
  // },
  card3: {
    width: "100%",
    height: "auto",
    marginLeft: "19.2%",
    paddingLeft: "0%",
    paddingRight: "0%",
    marginRight: "auto",
    paddingBottom: "0%",
    marginBottom: "1%",
    fontSize: "25px",
  },
  // card4: {
  //   width: "60%",
  //   marginLeft: "30px",
  // },
  media: {
    height: "150px",
    width: "100px",
  },
  namecard: {
    paddingTop: 15,
    // paddingLeft: 200,
    // paddingBottom: 20,
    // paddingTop: "3%",
    // color: "black",
  },
  subcard: {
    width: "4%",
    marginLeft: "26.2%",
    fontSize: "23px",
  },
  subcard1: {
    width: "6%",
    marginLeft: "5%",
    fontSize: "23px",
  },
  mbi: {
    color: "grey",
  },
  cardpaper: {
    width: "55vw",
    marginRight: "10%",
    marginLeft: "12%",
    marginBottom: "10%",
    height: "auto",
    background: "#ececec",
  },
  cardpaper1: {
    width: "45vw",
    marginRight: "10%",
    marginLeft: "0%",
    marginBottom: "10%",
    height: "auto",
    background: "#ececec",
  },
  cardpaper2: {
    width: "45vw",
    marginRight: "10%",
    marginLeft: "0%",
    marginBottom: "10%",
    height: "auto",
    background: "white",
  },
  editButton: {
    border: "solid 1px",
    padding: "1px",
    float: "right",
    marginTop: 23,
    marginLeft: 20,
    marginRight: 5,
    height: 8,
    width: 35,
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
      radius: "solid 1px",
    },
  },
  text4: {
    marginLeft: 100,
  },
  editicon: {
    fontSize: "medium",
  },
  avatar: {
    marginTop: 6,
    marginRight: 10,
  },
  box1: {
    width: "80%",
  },
  libraryCol: {
    maxWidth: 70,
  },
  imagecard: {
    marginLeft: "10%",
    marginBottom: "5%",
  },
  button1: {
    backgroundColor: "#ececec",
    color: "black",
    width: "auto",
    marginLeft: "35%",
    marginRight: "auto",
    marginTop: "10%",
    marginBottom: "10%",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },

  filter: {
    borderRadius: "50%",
    border: "solid 0px",
    padding: "1%",
    marginTop: "-1%",
    backgroundColor: "#ececec",
    color: "white",

    fontSize: "small",
    color: "black",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
      radius: "solid 1px",
    },
  },

  buttoncreate: {
    backgroundColor: "black",
    color: "white",
    marginLeft: "36.8%",
    marginRight: "auto",
    marginBottom: "5%",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "black",
      color: "#ececec",
      textDecoration: "none",
    },
  },

  td: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },

  center: {
    marginLeft: "28.5%",
  },
});

const PublicProfile = () => {
  let { currentUser } = useContext(AuthContext);
  let { profileUserId } = useParams();
  let [profileData, setProfileData] = useState(null);
  let [libraryData, setLibraryData] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfileData() {
      const { data } = await axios.get(`/api/users/public_profile/${profileUserId}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      setProfileData(data);
      console.log(data);
    }
    getProfileData();
  }, [profileUserId]);

  useEffect(() => {
    async function getOwnerLibraries() {
      const { data } = await axios.get(`/api/libraries/user/${profileUserId}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log("Content", data);
      if (data.libraries) setLibraryData(data.libraries);
    }
    getOwnerLibraries();
  }, []);

  const [scrollX, setScrollX] = useState(0);
  const buildUserProfile = (profileData) => {
    return (
      <>
        <Grid>
          <Card elevation={15} className={classes.namecard}>
            <br />
            <Grid container justifyContent="center">
              {!profileData.profile.userAvatar && (
                <Avatar sx={{ width: 84, height: 84 }} className={classes.avatar} alt="avatar">
                  {profileData.profile.displayName.substring(0, 2)}
                </Avatar>
              )}
              {profileData.profile.userAvatar && (
                <Avatar
                  sx={{ width: 84, height: 84 }}
                  src={profileData.profile.userAvatar}
                  className={classes.avatar}
                  alt="avatar"
                ></Avatar>
              )}
            </Grid>
            <br />
            <Divider />
            <br />
            <Grid container justifyContent="center">
              <Typography variant="h2" component={"h1"}>
                {profileData.profile.displayName}
              </Typography>
              {currentUser.uid === profileData.profile._id && (
                <>
                  <label hidden for="profileId">
                    {" "}
                  </label>
                  <Fab
                    className={classes.editButton}
                    id="profileId"
                    onClick={() => navigate(`/users/${profileData.profile._id}/edit`)}
                  >
                    <Edit />
                  </Fab>
                </>
              )}
            </Grid>
            <br />
            <br />
            <Stack direction="row" className={classes.card3} spacing={5}>
              <Card className={classes.subcard} elevation={0}>
                <MenuBookIcon className={classes.mbi} /> &nbsp;&nbsp;
                {profileData.profile.storiesCreated.length}
              </Card>
              &nbsp; &nbsp;
              <Card className={classes.subcard1} elevation={0}>
                <LibraryAddIcon className={classes.mbi} /> &nbsp;&nbsp;
                {!libraryData.private && libraryData.length}
              </Card>
            </Stack>
          </Card>

          <br />

          <Stack direction="row" className={classes.libraryCol} spacing={2}>
            <span>
              <div>
                <br />
                <br />
                <br />
                <Stack direction="row">
                  <Paper className={classes.cardpaper} elevation={0}>
                    <Card elevation={10}>
                      <br />

                      <Typography variant="h4" component={"h2"} className={classes.textstory}>
                        Stories Written &nbsp;
                        <label hidden for="filter">
                          filter
                        </label>
                        <Fab className={classes.filter} onClick={() => navigate(`/stories/manage`)} id="filter">
                          <FilterListIcon />
                        </Fab>
                      </Typography>

                      <br />
                      <Divider />
                      <br />
                      {profileData && profileData.profile.storiesCreated.length === 0 && (
                        <Typography variant="body2">The user haven't posted any stories yet!</Typography>
                      )}
                      <br />
                      <br />
                      <Stack direction={"column"} spacing={2}>
                        {profileData &&
                          profileData.profile.storiesCreated.map((profile, idx) => {
                            if (idx > 2) {
                              return;
                            }
                            return (
                              <Stack direction="row" spacing={5}>
                                <Card className={classes.imagecard}>
                                  <CardActionArea>
                                    <Link to={`/stories/${profile._id}`}>
                                      <CardMedia
                                        className={classes.media}
                                        component="img"
                                        image={profile.coverImage ? profile.coverImage : noImage}
                                        alt="img"
                                      />
                                    </Link>
                                  </CardActionArea>
                                </Card>

                                <Card elevation={0}>
                                  <Link to={`/stories/${profile._id}`}>
                                    <Typography style={{ textTransform: "uppercase" }}>{profile.title}</Typography>
                                  </Link>
                                  <br />

                                  <Typography>
                                    {profile.shortDescription.length > 50
                                      ? profile.shortDescription.substring(0, 50) + "...."
                                      : profile.shortDescription}
                                  </Typography>
                                  <br />
                                  <Stack direction="row" spacing={1}>
                                    {profile &&
                                      profile.genres &&
                                      profile.genres.map((genre) => {
                                        return (
                                          <Chip
                                            label={genre}
                                            size={"small"}
                                            color="info"
                                            onClick={() => navigate(`/stories/choose/${genre}`)}
                                          />
                                        );
                                      })}
                                  </Stack>
                                </Card>
                              </Stack>
                            );
                          })}
                      </Stack>

                      {profileData.profile.storiesCreated.length > 3 && (
                        <Button className={classes.button1} onClick={() => navigate(`/users/${profileUserId}/stories`)}>
                          View More
                        </Button>
                      )}
                    </Card>
                  </Paper>
                  <Paper className={classes.cardpaper1} elevation={0}>
                    <Card className={classes.cardpaper2} elevation={10}>
                      <Typography variant="h3" component={"h2"} className={classes.text}>
                        {currentUser.uid === profileUserId ? "Your" : ""} Public Libraries
                      </Typography>
                      <br />
                      {libraryData && libraryData.length === 0 && currentUser.uid === profileUserId && (
                        <Link to={`/libraries/create`} className={classes.td}>
                          {" "}
                          <Button className={classes.buttoncreate}>Create new library</Button>{" "}
                        </Link>
                      )}
                      {currentUser.uid !== profileUserId && libraryData.length === 0 && (
                        <div className={classes.center}>This user has not added any public libraries yet.</div>
                      )}
                      <Stack direction="column" spacing={2}>
                        {libraryData &&
                          libraryData.length > 0 &&
                          libraryData.map((lib, idx) => {
                            if (!lib.private)
                              return (
                                <Card>
                                  <CardContent>
                                    <Stack direction="row" spacing={2}>
                                      <Badge
                                        anchorOrigin={{
                                          vertical: "bottom",
                                          horizontal: "right",
                                        }}
                                      >
                                        {lib.private ? (
                                          <Tooltip placement="left" arrow title="Private">
                                            <LockIcon />
                                          </Tooltip>
                                        ) : (
                                          <Tooltip placement="left" arrow title="Public">
                                            <LockOpenIcon />
                                          </Tooltip>
                                        )}
                                      </Badge>

                                      <Link to={`/libraries/${lib._id}`}>
                                        <Typography variant="body1">
                                          {lib.libraryName.length > 20
                                            ? lib.libraryName.length.substring(16) + "..."
                                            : lib.libraryName}
                                        </Typography>
                                      </Link>

                                      {/* <CardActionArea>

                                      <Link to={`/stories/${libraryData.stories._id}`}>
                                        <CardMedia></CardMedia>
                                      </Link>
                                    </CardActionArea> */}

                                      <Typography variant="overline">({lib.stories.length} Stories Inside)</Typography>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              );
                          })}
                      </Stack>
                    </Card>
                  </Paper>
                </Stack>

                <br />
              </div>
              {/* </Stack> */}
            </span>
          </Stack>
          {/* </Grid> */}
        </Grid>
      </>
    );
  };
  return <div>{profileData && <div>{buildUserProfile(profileData)}</div>}</div>;
};

export default PublicProfile;
