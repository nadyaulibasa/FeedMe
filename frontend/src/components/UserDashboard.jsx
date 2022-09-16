import React from 'react'
import EditProfileModal from './EditProfileModal';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from './styles/UserDashboard.module.css'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { APICall } from '../helperFunc';


const UserDashboard = (props) => {
  const theme = createTheme({
    components: {
      MuiTab: {
        styleOverrides: {
          textColorPrimary: {
            color: "black",
            fontSize: "0.9em",
            fontWeight: "900"
          },
          root: {
            "&.Mui-selected": {
              color: "white"
            }
          }
        }
      },
    },
  });

  const [profileData, setProfileData] = React.useState('')

  const getProfile = async() => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'token' : localStorage.getItem('token')
      };
      const temp_data = await APICall(null, '/dash/get_details', 'GET', headers);
      setProfileData(temp_data.user_details)
    } catch (err) {
      alert(err);
    }
  }

  React.useEffect(() => {
    getProfile()
  }, [])

  //Modal State
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  //Tab States
  const handleChange = (event, newValue) => {
    props.setTabValue(newValue);
  };
  const matches = useMediaQuery('(min-width:500px)');

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className={styles.container}>
          <div className={styles.userContainer}>
            <div style={{position:'relative'}}> 
              <Avatar
              alt="Profile Picture"
              src={profileData.profile_picture}
              sx={{ width: 250, height: 250 }}
              />
              <IconButton aria-label="Edit profile" onClick={handleOpen} sx={{
                backgroundColor: "aquamarine", ml: 2, '&:hover':{backgroundColor:"green"},
                position:'absolute', bottom: 0, right: 30
              }}>
                <EditIcon />
              </IconButton>
            </div>
            <div className={styles.name}> 
              {profileData.username}
            </div>
            <div>
              {profileData.email}
            </div>
          </div>
          <div className={styles.tabsContainer}>
            <Tabs
              value={props.tabValue}
              onChange={handleChange}
              aria-label="types of recipe"
              centered="true"
              sx={{
                width: "100%",
                "& .MuiTabs-flexContainer": {
                  width: "100%",
                  justifyContent: 'space-evenly',
                },
                "& .MuiTabs-indicator": {
                  width: "100%",
                  backgroundColor: "red",
                },
              }}
            >
              <Tab icon={<FavoriteIcon />} iconPosition="start" label={ (matches) ? "Saved Recipe" : "" } value="Saved"/>
              <Tab icon={<GradeIcon />} iconPosition="start" label={ (matches) ? "Rated Recipe" : "" } value="Rated"/>
              <Tab icon={<PersonIcon />} iconPosition="start" label={ (matches) ? "My Recipe" : "" } value="Own"/>
              <Tab icon={<VideoFileIcon />} iconPosition="start" label={ (matches) ? "Saved Video" : "" } value="Video"/>
            </Tabs>
          </div>
        </div>
        <EditProfileModal isContributor={false} open={open} setOpen={setOpen} handleAfterUpdate={getProfile}></EditProfileModal>
      </ThemeProvider>
    </>
  )
}

export default UserDashboard