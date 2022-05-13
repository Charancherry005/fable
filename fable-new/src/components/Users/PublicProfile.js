import { Alert, Avatar, Fab, Stack } from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Edit from "@mui/icons-material/Edit";
import ViewLibrariesList from "../Libraries/ViewLibrariesList";

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
    marginLeft: "11.5%",
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
  card1: {
    width: "auto",
    height: "8%",
    marginLeft: "10%",
    paddingLeft: "0%",
    paddingRight: "0%",
    marginRight: "2%",
    paddingBottom: "0%",
    marginBottom: "1%",
    fontSize: "25px",
  },
  card2: {
    width: "15%",
    marginBottom: "100px",
    paddingBottom: "2%",
    height: "2%",
  },
  card3: {
    width: "100%",
    height: "auto",
    marginLeft: "17%",
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
    height: "300px",
    width: "200px",
  },
  namecard: {
    paddingTop: 15,
    // paddingLeft: 200,
    // paddingBottom: 20,
    // paddingTop: "3%",
    // color: "black",
  },
  subcard: {
    width: "6%",
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
});

const PublicProfile = () => {
  let { currentUser } = useContext(AuthContext);
  let { profileUserId } = useParams();
  let [profileData, setProfileData] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfileData() {
      const { data } = await axios.get(
        `/api/users/public_profile/${profileUserId}`,
        {
          headers: { authtoken: await currentUser.getIdToken() },
        }
      );
      setProfileData(data);
      console.log(data);
    }
    getProfileData();
  }, [profileUserId]);

  const [scrollX, setScrollX] = useState(0);
  const buildUserProfile = (profileData) => {
    return (
      <>
        <Grid>
          <Card elevation={15} className={classes.namecard}>
            <Grid container justifyContent="center">
              {!profileData.profile.userAvatar && (
                <Avatar
                  sx={{ width: 64, height: 64 }}
                  className={classes.avatar}
                >
                  {profileData.profile.displayName.substring(0, 2)}
                </Avatar>
              )}
              {profileData.profile.userAvatar && (
                <Avatar
                  sx={{ width: 64, height: 64 }}
                  src={profileData.profile.userAvatar}
                  className={classes.avatar}
                ></Avatar>
              )}
            </Grid>
            <br />
            <Divider />
            <br />
            <Grid container justifyContent="center">
              <Typography variant="h2" component={"h2"}>
                {profileData.profile.displayName}
              </Typography>
              {currentUser.uid === profileData.profile._id && (
                <Fab
                  className={classes.editButton}
                  onClick={() =>
                    navigate(`/users/${profileData.profile._id}/edit`)
                  }
                >
                  <Edit />
                </Fab>
              )}
            </Grid>
            <br />
            <br />
            <Stack direction="row" className={classes.card3} spacing={5}>
              <Card className={classes.subcard} elevation={0}>
                <Typography
                  variant="h6"
                  component={"h2"}
                  className={classes.text1}
                >
                  <MenuBookIcon />
                </Typography>
              </Card>
              &nbsp; &nbsp;
              <Card className={classes.subcard} elevation={0}>
                <Typography
                  variant="h6"
                  component={"h2"}
                  className={classes.text1}
                >
                  <LibraryAddIcon />
                </Typography>
              </Card>
            </Stack>
          </Card>
          <br />
          <Typography variant="h3" component={"h2"} className={classes.text}>
            Stories written
          </Typography>
          <br />

          <br />
          <br />
          <Stack direction="column">
            <div>
              <Stack direction="column">
                {profileData.profile &&
                  profileData.profile.storiesCreated.map(
                    (createdStory, idx) => {
                      if (idx > 4) {
                        return;
                      }
                      return (
                        <Grid key={idx}>
                          <Stack direction="row">
                            <Card className={classes.card1} elevation={15}>
                              <Link to={`/stories/${createdStory._id}`}>
                                <CardMedia
                                  className={classes.media}
                                  component="img"
                                  image={createdStory.coverImage}
                                />
                              </Link>
                            </Card>

                            <Card className={classes.card2} elevation={0}>
                              <CardContent>
                                <Link to={`/stories/${createdStory._id}`}>
                                  <Typography>{createdStory.title}</Typography>
                                </Link>
                              </CardContent>
                              <CardContent>
                                <Typography>
                                  {createdStory.shortDescription.length > 200
                                    ? createdStory.shortDescription.substring(
                                        0,
                                        197
                                      ) + "..."
                                    : createdStory.shortDescription}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Stack>
                        </Grid>
                      );
                    }
                  )}
              </Stack>
              <Button onClick={() => navigate(`/stories/manage`)}>
                View More
              </Button>
            </div>
            <Box className={classes.box1}>
              <Grid>
                <Card className={classes.card4}>
                  <ViewLibrariesList />
                </Card>
              </Grid>
            </Box>
          </Stack>
        </Grid>
      </>
    );
  };
  return <div>{profileData && <div>{buildUserProfile(profileData)}</div>}</div>;
};

export default PublicProfile;
