# Philippine Administrative Divisions - Cascading Dropdown System

This enhancement adds a comprehensive cascading dropdown system for selecting Philippine administrative divisions (Region → Province → Municipality → Barangay) when uploading coral reef images.

## 🌟 Features

- **Cascading Dropdowns**: Like Google Forms, each selection narrows down the next options
- **Real-time Loading**: Dynamic data loading with loading indicators
- **Location Validation**: Ensures proper administrative hierarchy
- **Additional Fields**: Transect ID and Site Name for research purposes
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Automatic dark/light theme adaptation

## 📁 Files Added/Modified

### Backend Files

- `routes/philippine_locations.py` - API endpoints for cascading dropdowns
- `migration_add_location_fields.sql` - Database migration script
- `populate_philippine_locations.py` - Data population script
- `test_locations_api.py` - API testing script
- `routes/gis_routes.py` - Modified to handle administrative data
- `routes/__init__.py` - Added new blueprint registration

### Frontend Files

- `components/guest/components/LocationSelector.jsx` - Enhanced with cascading dropdowns
- `components/guest/styles/LocationSelector.css` - New styling for form components

### Database Schema

- Added columns to `images` table: `region`, `province`, `municipality`, `barangay`, `transect`, `site_name`
- New `philippine_locations` table for administrative divisions hierarchy

## 🚀 Setup Instructions

### 1. Database Migration

First, run the migration script to add the new columns:

```bash
# Connect to your PostgreSQL database and run:
psql -d your_database_name -f backend/migration_add_location_fields.sql
```

### 2. Populate Location Data

Run the Python script to populate Philippine administrative divisions:

```bash
cd backend
python populate_philippine_locations.py
```

### 3. Test API Endpoints

Verify the API is working correctly:

```bash
cd backend
python test_locations_api.py
```

### 4. Start the Application

Make sure your Flask server is running with the new routes:

```bash
cd backend
python app.py
```

## 🔧 API Endpoints

The new system adds these endpoints:

- `GET /locations/regions` - Get all Philippine regions
- `GET /locations/provinces/{region_code}` - Get provinces for a region
- `GET /locations/municipalities/{province_code}` - Get municipalities for a province
- `GET /locations/barangays/{municipality_code}` - Get barangays for a municipality
- `POST /locations/populate_sample_data` - Populate sample data (development)

## 📊 Database Schema

### New Columns in `images` Table

```sql
region VARCHAR(100)           -- e.g., "Region IV-A (CALABARZON)"
province VARCHAR(100)         -- e.g., "Batangas"
municipality VARCHAR(100)     -- e.g., "Mabini"
barangay VARCHAR(100)         -- e.g., "Anilao"
transect VARCHAR(50)          -- e.g., "T1", "Transect A"
site_name VARCHAR(255)        -- e.g., "Coral Garden", "Marine Sanctuary"
```

### New `philippine_locations` Table

```sql
CREATE TABLE philippine_locations (
    id SERIAL PRIMARY KEY,
    region_code VARCHAR(20),
    region_name VARCHAR(100) NOT NULL,
    province_code VARCHAR(20),
    province_name VARCHAR(100),
    municipality_code VARCHAR(20),
    municipality_name VARCHAR(100),
    barangay_code VARCHAR(20),
    barangay_name VARCHAR(100),
    location_type VARCHAR(20) NOT NULL, -- 'region', 'province', 'municipality', 'barangay'
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Usage

### For Users

1. **Upload Images**: When uploading coral reef images, users now see a location form
2. **Select Region**: Choose from Philippine regions (e.g., "Region IV-A (CALABARZON)")
3. **Select Province**: Dropdown populates with provinces in the selected region
4. **Select Municipality**: Dropdown shows municipalities in the selected province
5. **Select Barangay**: Final dropdown shows barangays in the selected municipality
6. **Optional Fields**: Add transect ID and site name for research purposes
7. **Save**: Location data is stored with the images

### For Developers

```javascript
// Frontend usage example
const [selectedRegion, setSelectedRegion] = useState("");
const [provinces, setProvinces] = useState([]);

const handleRegionChange = async (regionCode) => {
  setSelectedRegion(regionCode);
  const response = await fetch(`/locations/provinces/${regionCode}`);
  const data = await response.json();
  setProvinces(data.provinces);
};
```

## 🗺️ Sample Locations Included

The system includes sample data for major coral reef areas:

### Regions

- **Region IV-A (CALABARZON)** - Batangas coral reefs
- **Region VII (Central Visayas)** - Bohol, Cebu coral triangle
- **Region IV-B (MIMAROPA)** - Palawan world heritage reefs
- **Region VIII (Eastern Visayas)** - Eastern Visayas coral areas

### Famous Coral Reef Locations

- **Anilao, Batangas** - Macro diving capital
- **Panglao, Bohol** - World-class coral walls
- **El Nido, Palawan** - Limestone karst and coral gardens
- **Coron, Palawan** - Wreck diving and coral reefs
- **Moalboal, Cebu** - Sardine run and coral walls

## 🔍 Testing

### Manual Testing

1. Open the guest upload page
2. Upload coral reef images
3. Click the location selector
4. Test the cascading dropdowns:
   - Select a region → provinces should load
   - Select a province → municipalities should load
   - Select a municipality → barangays should load
5. Fill in optional transect and site name
6. Save and verify data in database

### Automated Testing

```bash
# Test API endpoints
python backend/test_locations_api.py

# Test with sample data population
python backend/test_locations_api.py --populate
```

## 📝 Data Sources

The included sample data covers major coral reef areas in the Philippines. For comprehensive coverage, you can:

1. **Philippine Statistics Authority (PSA)**: Official administrative divisions
2. **NAMRIA**: National mapping and resource information
3. **Local Government Units**: For accurate barangay listings

## 🌐 Integration Points

### Frontend Components

- `LocationSelector.jsx` - Main cascading dropdown interface
- `Distribution.jsx` - Now displays administrative location data
- Image upload flows - All now include location selection

### Backend Routes

- `gis_routes.py` - Updated to store administrative data
- `distribution_routes.py` - Queries can filter by administrative divisions
- `philippine_locations.py` - New cascading dropdown API

## 🎨 UI/UX Features

- **Progressive Loading**: Only load data when needed
- **Loading Indicators**: Spinning icons during API calls
- **Form Validation**: Required fields clearly marked
- **Responsive Design**: Works on mobile and desktop
- **Accessibility**: Proper labels and keyboard navigation
- **Dark Mode**: Automatic theme adaptation

## 🔧 Troubleshooting

### Common Issues

1. **Dropdowns not loading**

   - Check Flask server is running
   - Verify database connection
   - Check browser console for API errors

2. **Missing data in dropdowns**

   - Run the population script: `python populate_philippine_locations.py`
   - Check database has `philippine_locations` table
   - Verify data exists: `SELECT COUNT(*) FROM philippine_locations;`

3. **API errors**
   - Check Flask console for Python errors
   - Verify new routes are registered in `__init__.py`
   - Test endpoints with: `python test_locations_api.py`

### Database Issues

```sql
-- Check if migration was applied
\d images;  -- Should show new columns

-- Check location data
SELECT location_type, COUNT(*) FROM philippine_locations GROUP BY location_type;

-- Verify indexes exist
\di idx_images_region;
```

## 🚀 Future Enhancements

1. **Complete PSA Data**: Import full Philippine administrative divisions
2. **GPS Integration**: Auto-detect location from image EXIF data
3. **Marine Protected Areas**: Add MPA boundaries and names
4. **Bathymetry Data**: Include depth information
5. **Local Names**: Support for local/indigenous place names
6. **Bulk Import**: CSV/Excel import for bulk location data

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Run the test scripts to verify setup
3. Check Flask and browser console logs
4. Verify database schema and data

The cascading dropdown system provides a user-friendly way to capture precise location data for coral reef research and monitoring! 🐠🪸
