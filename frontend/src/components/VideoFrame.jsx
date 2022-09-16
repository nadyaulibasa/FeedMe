import React from 'react'

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VideoFrame = (props) => {
  const vid = props.url
  const getYouTubeId = require('get-youtube-id')
  const id = getYouTubeId(vid)

  return (
    <div>
      <Dialog
        open={props.openState}
        fullWidth={true}
        maxWidth='xl'
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        aria-describedby="alert-dialog-slide-description"
      > 
        <iframe
          style={{
            width: '100%',
            aspectRatio: 4 / 1.7,
          }}
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          allowFullScreen>  
        </iframe>
      </Dialog>
    </div>
  )
}

export default VideoFrame