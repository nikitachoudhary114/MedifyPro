import axios from "axios";

// Controller to fetch nearby pharmacies, hospitals, etc.
const getNearbyPlaces = async (req, res) => {
  try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
          return res.status(400).json({ success: false, message: "Location is required" });
      }

    const types = ["pharmacy"];
    const allResults = [];

    for (const type of types) {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=${type}&key=${process.env.API_KEY}`;
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        allResults.push(...response.data.results);
      }
        // console.log(response.data);
        // console.log(`Requesting: ${url}`);

      }
      


    // if (allResults.length === 0) {
    //     return res.status(404).json({ success: false, message: 'No nearby places found' });
      // }
      


    res.status(200).json({ success: true, places: allResults });
  } catch (error) {
    console.error("Error fetching from Google Maps:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch nearby places from Google Maps",
      });
  }
};

export { getNearbyPlaces };
