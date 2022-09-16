import React from 'react';
import { APICall } from '../helperFunc';
import Pagination from '@mui/material/Pagination';
import NavigationBarHome from '../components/NavigationBarHome';
import VideoCard from '../components/VideoCard';
import VideoSearchBar from '../components/VideoSearchBar';
import Loading from '../components/Loading';

export default function TeachUsScreen () {

  const [skillVideos, setSkillVideos] = React.useState([])
  const [isContributor, setIsContributor] = React.useState('')
  const [foundVideos, setFoundVideos] = React.useState([])
  const [currentPage, setCurrentPage] = React.useState(-1)
  const [maxPage, setMaxPage] = React.useState(-1)
  const [loading, setLoading] = React.useState(true)

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const getSkillVideos = async() => {
    let data = []; let temp = [];
    try {
      const headers = {
        'Content-Type': 'application/json',
        'token' : localStorage.getItem('token')
      };
      data = await APICall(null, `/skill_videos`, 'GET', headers);
      setSkillVideos(data.video_list);
      let temp;
      if (searchedTitle !== '') {
        temp = data.video_list.filter((video) => {
          if (video.title.toLowerCase().includes(searchedTitle.toLowerCase())) return video
        })
        setFoundVideos(temp)
      } else {
        temp = data.video_list
        setFoundVideos(temp)
      }
      setMaxPage(Math.ceil(temp.length / 9))
    } catch (err) {
      alert(err);
    }
  }

  const checkIfContributor = async() => {
    let data = []; let temp = [];
    try {
      const headers = {
        'Content-Type': 'application/json',
        'token' : localStorage.getItem('token')
      };
      data = await APICall(null, `/is_contributor`, 'GET', headers);
      setIsContributor(data.is_contributor)
    } catch (err) {
      alert(err);
    }
  }

  React.useEffect(() => {
    if(loading != true) {
      getSkillVideos()
      if (localStorage.getItem('token')) checkIfContributor()
    }
  },[loading])

  const [searchedTitle, setSearchedTitle] = React.useState("")
  const filterVideo = () => {
    let temp;
    if (searchedTitle !== '') {
      temp = skillVideos.filter((video) => {
        if (video.title.toLowerCase().includes(searchedTitle.toLowerCase())) return video
      })
      setFoundVideos(temp)
    } else {
      temp = skillVideos
      setFoundVideos(temp)
    }
    setMaxPage(Math.ceil(temp.length / 9))
  }
  
  React.useEffect(() => {
    setCurrentPage(1)
    filterVideo()
  }, [searchedTitle])
  


  const renderVideoCard = () => {
    let content = []
    if (foundVideos.length !== 0) {
      let index = (currentPage - 1 ) * 9
      let times = 9
      if (currentPage === maxPage) times = foundVideos.length % 9
      if (times === 0) times = 9
      for (let i = 0; i < times; i++) {
        content.push(
          <VideoCard url={foundVideos[index]['url']} object={foundVideos[index]} isContributor={isContributor} afterLike={() => {getSkillVideos()}}/>
        )
        index++;
      }
      return (
        <div style={{width: '100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <div style={{
            width: '95%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            alignContent: 'space-between',
            marginTop: '20px',
          }}>
            {content}
          </div>
          <Pagination count={maxPage} page={currentPage} onChange={handleChange} size="large" color='primary' sx={{paddingBottom: 5, paddingTop: 5}}/>
        </div>
      )
    }
  }


  return (
    <>
      {(loading && <Loading close={() => {setLoading(false)}}></Loading>)}
      {(!loading) && <div>
        <NavigationBarHome style={{ alignSelf: 'start' }} ></NavigationBarHome>
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <VideoSearchBar wordEntered={searchedTitle} setWordEntered={setSearchedTitle}></VideoSearchBar>
          {renderVideoCard()} 
        </div>
      </div>}
    </>
  )
}
