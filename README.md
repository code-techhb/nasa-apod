# Web Development Project 3 - NASA Astronomy Picture of the Day Explorer

Submitted by: **Houlaymatou B.**

This web app: allows users to discover NASA's Astronomy Pictures of the Day from random dates, view image details, maintain a viewing history, and create a ban list of images they don't want to see again

## Required Features

The following **required** functionality is completed:

- [✅] **Application features a button that creates a new API fetch request on click and displays at least three attributes and an image obtained from the returned JSON data**
  - The application displays the title, date, and explanation for each NASA APOD image, along with the image itself
- [✅] **Only one item/data from API call response is viewable at a time and at least one image is displayed per API call**
  - The app shows one NASA image at a time in the main viewer
  - Each image is accompanied by its corresponding title, date, and explanation
- [✅] **API call response results should appear random to the user**
  - The "Discover" button generates a random date between June 16, 1995 (first APOD) and today, ensuring a seemingly random new result each time
- [✅] **Clicking on a displayed value for one attribute adds it to a displayed ban list**
  - The "Ban This Image" button adds the current image to the ban list
  - Banned images are displayed in a dedicated "Ban List" section
  - Each banned image can be removed from the ban list with the "Remove from Ban List" button
- [✅] **Attributes on the ban list prevent further images/API results with that attribute from being displayed**
  - Images in the ban list are never shown again when clicking the Discover button
  - If a banned image would be shown, the app automatically fetches another image

The following **optional** features are implemented:

- [❌] Multiple types of attributes are clickable and can be added to the ban list
- [✅] Users can see a stored history of their previously displayed results from this session
  - The "Already Seen" section displays thumbnails of all previously viewed images
  - Clicking on any thumbnail in the history displays that image in the main viewer

The following **additional** features are implemented:

- [✅] Implemented robust duplicate checking to prevent duplicate entries in both Already Seen and Ban List
- [✅] Added loading state with animation to provide visual feedback during API requests
- [✅] Ensured the app handles video content (some NASA APOD entries are videos)
- [✅] Added error handling for API request failures with user-friendly error messages

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='solution.mp4' title='Video Walkthrough' width='' alt='Video Walkthrough' />
GIF created with imgur

## Notes

Challenges encountered while building the app:

- Handling duplicate entries in the Already Seen and Ban lists required careful implementation of unique IDs
- Initially the app was loading images on startup, but fixed it to wait for user action
- The NASA API sometimes returns video content instead of images, which required special handling
- Ensuring proper error handling for API failures to provide a good user experience
- Managing state between the main viewer, Already Seen list, and Ban List required careful coordination

## License

    Copyright [2025] [Houlaymatou B.]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
