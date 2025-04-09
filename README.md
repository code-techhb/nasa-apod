# Web Development Project 5 - _NASA APOD Explorer_ 🪐

Submitted by: **Houlaymatou B.**

This web app: **A dashboard application that lets users explore NASA's Astronomy Picture of the Day archive, save favorites, rate images, and filter content through an advanced dashboard interface.**

## Required Features ✨

The following **required** functionality is completed:

- [x] **The site has a dashboard displaying a list of data fetched using an API call**
  - The dashboard displays favorite astronomical images and videos, one per row
  - Each row includes image thumbnail, title, author, date, media type, and rating
- [x] **`useEffect` React hook and `async`/`await` are used**
  - Used for API calls to NASA's APOD service and for localStorage persistence
- [x] **The app dashboard includes at least three summary statistics about the data**
  - Total number of favorite images
  - Average rating across all favorites
  - Distribution of media types (images vs videos)
- [x] **A search bar allows the user to search for an item in the fetched data**
  - The search bar correctly filters by author name or date
  - Results update dynamically as users type in the search field
- [x] **An additional filter allows the user to restrict displayed items by specified categories**
  - Filters include author, rating, and media type
  - Each filter correctly restricts the displayed items
  - The dashboard updates immediately as filters are applied

The following **optional** features are implemented 🚀:

- [x] Multiple filters can be applied simultaneously
  - Search, author filter, rating filter, and media type filter work together
- [x] Filters use different input types
  - Text input for search
  - Dropdown selections for author, rating, and media type
- [x] The user can enter specific bounds for filter values
  - Rating filter allows selecting minimum rating threshold (3+, 4+, or 5 hearts)

The following **additional** features are implemented 🎉:

- [x] Local storage persistence to save user preferences between sessions
- [x] Rating system that allows users to rate images with 3-5 hearts
- [x] React Router implementation for navigation between views
- [x] Image click functionality to view full details in main explorer
- [x] Confirmation dialog before clearing user data
- [x] Responsive design that works on mobile and desktop devices
- [x] Unknown author filtering option for images without copyright information

## Video Walkthrough 👩🏽‍💻

Here's a walkthrough of implemented user stories:

<img src='https://imgur.com/CLiwBng' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->

GIF created with Imgur

## Notes 📝

Challenges encountered while building the app:

- Managing multiple state variables across different components
- Implementing proper filtering logic that could handle all filter combinations
- Optimizing performance with useMemo for filtered data
- Managing responsive design for both the explorer and dashboard views
- Handling cases where the NASA API returned incomplete data (missing copyright/author information)

## License ⚖️

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
