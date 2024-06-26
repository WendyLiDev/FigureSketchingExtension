# Figure Drawing Practice Helper

**Note: It is reccomended to use this extension with Youtube**

Figure sketching involves capturing the human form focusing on proportions, anatomy, and the fluidity of poses. The best way to start is with numerous quick sketches to build an understanding of the subject's movement and essence. This approach helps artists develop their observational skills and hand-eye coordination, allowing them to depict the human figure more naturally and dynamically. Quick sketches encourage experimentation and reduce the pressure to create perfect drawings, fostering a more intuitive and spontaneous artistic process. By practicing this way, artists can achieve greater confidence and proficiency in their figure sketching abilities.

This is a basic extension that finds the video on the page, pauses the frame for a set amount of time, and then skips over to another frame in the video. It's best to start off with a lower duration for the sketch time then working up towards lengthier and more detailed sketches. However, feel free to use the tool however you like and what suits your needs best!

![An example of figure sketches pulled from a video compared to the resulting sketch](https://github.com/WendyLiDev/FigureSketchingExtension/blob/main/images/figure_sketch_references.png?raw=true)


## UI Design - [Figma](https://www.figma.com/proto/c8DJ7aHhBRdEGXLvcpFCch/Figure-Sketch-Helper?t=zJ0Wh597nUNkXJ4s-1)
Opting for a simple greyscale interface that doesn't distract from the content on the page. 

![The user interface design of the controls for the figure sketching timer tool.](https://github.com/WendyLiDev/FigureSketchingExtension/blob/main/images/figma.png?raw=true)



Timer almost out of time             |  Skipped to the next frame
:-------------------------:|:-------------------------:
![The timer is counting down on a paused frame of the video](https://github.com/WendyLiDev/FigureSketchingExtension/blob/main/images/README_timer_1.png?raw=true)  |  ![The timer counted down and upon reaching 0, has skipped over 2 seconds to show the next frame of the video and reset the timer](https://github.com/WendyLiDev/FigureSketchingExtension/blob/main/images/README_timer_2.png?raw=true)

## Technical Challenges
This is a basic Chrome extension written with vanilla JavaScript, HTML, and CSS that finds the video on the page, pauses the frame for a set amount of time, and then skips over to another frame in the video.

### Rendering the tool in the DOM

When rendering elements directly to the DOM, the elements will inherit styling from the page it is being rendered on. Unfortunately, this results in the UI looking differently on different pages. The best way to ensure that an element is not inheriting style from its parent is to render it in an iframe.

However, having the iframe communicate with the page to control where we are paused at in the video does add complexity and requires much of the styling to be rewritten. Seeing as the UI looks and functions as expected on YouTube, one of the biggest video streaming sites, this refactor does not prevent users from being able to use the tool. 

## Upcoming changes and Future thinking

1. Reworking the timer to exist in an iframe to ensure it looks the same on all pages
1. Adding the ability to minimize the UI (shown in the Figma)
1. Keeping the UI rendered in the dom when navigating between pages
1. Buttons to skip between individual frames if the current frame is blurry
1. Using blur detection on the n frames closest to the timestamp and determining which frame is the least blurry
