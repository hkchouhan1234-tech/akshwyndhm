import streamlit as st
import json
import os
import datetime

# Set page config
st.set_page_config(
    page_title="Aksh Wyndham Exports",
    page_icon="🌶️",
    layout="wide",
    initial_sidebar_state="expanded"
)

STORAGE_FILE = "spice_site_data.json"
ADMIN_PASSCODE = "spice2026"

# ----------------------------------------------------------------------
# DEFAULT DATA INITIALIZATION
# ----------------------------------------------------------------------
DEFAULT_DATA = {
    "settings": {
        "brandName": "Aksh Wyndham",
        "brandSuffix": "Exports",
        "tagline": "Pure spice. Direct from India.",
        "established": "2014",
        "countries": "40+",
        "varieties": "25+",
        "tonnage": "5,000+ MT",
        "heroEyebrow": "Merchant Exporters of Indian Spices",
        "heroTitle": "From the soil of India,\nto tables of the world.",
        "heroSubtitle": "Aksh Wyndham sources, tests and ships whole spices, ground spices and custom blends direct from India's growing belts to importers, retailers and food manufacturers worldwide.",
        "aboutEyebrow": "Who we are",
        "aboutTitle": "A trading house built on the spice route",
        "aboutText": "Aksh Wyndham is a merchant export house working directly with growers, mandis and processing units across India. We handle sourcing, lab testing, packaging and export documentation end to end, so importers receive consistent, traceable spice shipments without managing multiple vendors on the ground.\n\nEvery lot is sampled and tested before it leaves India, and every shipment carries the certificates your customs and food-safety authorities expect.",
        "phone": "+91 98765 43210",
        "email": "export@akshwyndham.com",
        "address": "204, Silver Trade Tower, Ashram Road, Ahmedabad, Gujarat 380009, India",
        "instagram": "https://www.instagram.com/aksh.wyndham",
        "logoText": "A",
        "primaryColor": "#A6321D",
        "accentColor": "#D9971C"
    },
    "products": [
        {"id": "p1", "name": "Turmeric", "latin": "Curcuma longa", "category": "Whole & Powder", "hsCode": "0910 30", "origin": "Andhra Pradesh & Tamil Nadu", "color": "#D9971C", "description": "High-curcumin turmeric fingers and powder, sun-dried and polished, available in Salem, Erode and Nizamabad grades."},
        {"id": "p2", "name": "Red Chilli", "latin": "Capsicum annuum", "category": "Whole & Powder", "hsCode": "0904 21", "origin": "Guntur, Andhra Pradesh", "color": "#A6321D", "description": "Guntur Sannam and Teja varieties, graded for colour value and pungency, whole pods or fine powder."},
        {"id": "p3", "name": "Black Pepper", "latin": "Piper nigrum", "category": "Whole Spices", "hsCode": "0904 11", "origin": "Idukki & Wayanad, Kerala", "color": "#3B3226", "description": "Malabar garbled black pepper, steam-sterilised, 500-570 g/l bulk density on request."}
    ],
    "regions": [
        {"id": "r1", "state": "Gujarat", "hub": "Unjha Mandi", "specialty": "Cumin, fennel & fenugreek", "description": "Asia's largest spice trading market — our home base for seed spices, sourced within a day of auction."}
    ],
    "features": [
        {"id": "f1", "icon": "🛡️", "title": "Lab-tested, every lot", "description": "Independent lab reports for pesticide residue, aflatoxin and microbial load accompany every shipment."}
    ],
    "blogPosts": [
        {
            "id": "b1",
            "title": "Guntur chilli: why Andhra's red gold leads global demand",
            "excerpt": "A look at what makes Guntur Sannam and Teja chillies the benchmark grade for importers worldwide.",
            "content": "Guntur, in Andhra Pradesh, produces some of the most sought-after chilli varieties in the world.",
            "date": "2026-05-12",
            "author": "Aksh Wyndham Desk",
            "tag": "Sourcing"
        }
    ],
    "messages": []
}

def load_data():
    if os.path.exists(STORAGE_FILE):
        try:
            with open(STORAGE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return DEFAULT_DATA
    return DEFAULT_DATA

def save_data(data):
    with open(STORAGE_FILE, "w") as f:
        json.dump(data, f, indent=4)

if "site_data" not in st.session_state:
    st.session_state.site_data = load_data()
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

data = st.session_state.site_data
s = data["settings"]

# Fallback keys for legacy JSON files missing the new color keys
if "logoText" not in s: s["logoText"] = "A"
if "primaryColor" not in s: s["primaryColor"] = "#A6321D"
if "accentColor" not in s: s["accentColor"] = "#D9971C"

# ----------------------------------------------------------------------
# CARD HOVER ANIMATIONS (CSS injection)
# ----------------------------------------------------------------------
st.markdown(f"""
    <style>
    .animated-card {{
        background-color: #f9f9f9; 
        padding: 20px; 
        border-radius: 12px; 
        margin-bottom: 20px;
        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;
    }}
    .animated-card:hover {{
        transform: translateY(-6px);
        box-shadow: 0 12px 20px rgba(0,0,0,0.08);
    }}
    </style>
""", unsafe_allow_html=True)

# ----------------------------------------------------------------------
# APP NAVIGATION CONTROLS
# ----------------------------------------------------------------------
st.sidebar.markdown(f"## 🌶️ {s['brandName']} Desk")
view = st.sidebar.radio("Navigate View", ["Main Website", "Journal / Blog", "Control Room Dashboard"])

# ----------------------------------------------------------------------
# MAIN WEBSITE VIEW
# ----------------------------------------------------------------------
if view == "Main Website":
    # Custom Brand Header with dynamic Logo and Branding colors
    st.markdown(f"""
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
            <div style="background-color: #17140F; color: {s['accentColor']}; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold;">
                {s['logoText']}
            </div>
            <h1 style="margin: 0; font-size: 28px;">{s['brandName']} <span style="color: {s['primaryColor']};">{s['brandSuffix']}</span></h1>
        </div>
    """, unsafe_allow_html=True)

    st.markdown(f"<p style='text-transform: uppercase; letter-spacing: 0.15em; color: {s['accentColor']}; font-weight: bold;'>{s['heroEyebrow']} · Est. {s['established']}</p>", unsafe_allow_html=True)
    st.title(s['heroTitle'])
    st.write(s['heroSubtitle'])
    
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Countries Served", s['countries'])
    col2.metric("Spice Varieties", s['varieties'])
    col3.metric("Exported Yearly", s['tonnage'])
    col4.metric("Trading Since", s['established'])
    
    st.divider()

    st.markdown(f"### 📍 {s['aboutEyebrow']}")
    st.markdown(f"## {s['aboutTitle']}")
    for paragraph in s['aboutText'].split("\n\n"):
        st.write(paragraph)
        
    st.divider()

    # Products Catalogue with Hover Animations
    st.markdown("### 📦 Our Spice Catalogue")
    categories = ["All"] + list(set(p["category"] for p in data["products"]))
    selected_category = st.selectbox("Filter Categories", categories)
    
    filtered_products = data["products"] if selected_category == "All" else [p for p in data["products"] if p["category"] == selected_category]
    
    prod_cols = st.columns(3)
    for index, p in enumerate(filtered_products):
        with prod_cols[index % 3]:
            st.markdown(
                f"""
                <div class="animated-card" style="border-left: 5px solid {p['color']};">
                    <span style="float: right; font-size: 0.8em; background-color: #ddd; padding: 2px 8px; border-radius: 10px;">HS {p['hsCode']}</span>
                    <h3>{p['name']}</h3>
                    <p><i>{p['latin']}</i></p>
                    <p>{p['description']}</p>
                    <p style="font-size: 0.9em; color: #555;">📍 <b>Origin:</b> {p['origin']}</p>
                </div>
                """, unsafe_allow_html=True
            )

    st.divider()

    st.markdown("### 🗺️ Spice Route Sourcing Hubs")
    if data["regions"]:
        reg_cols = st.columns(len(data["regions"]))
        for index, r in enumerate(data["regions"]):
            with reg_cols[index]:
                st.info(f"**{r['state']}** ({r['hub']})\n\n🌟 *{r['specialty']}*\n\n{r['description']}")

    st.divider()

    st.markdown("### ✨ Built for Global Quality Buyers")
    if data["features"]:
        feat_cols = st.columns(len(data["features"]))
        for index, f in enumerate(data["features"]):
            with feat_cols[index]:
                st.success(f"### {f['icon']} {f['title']}\n{f['description']}")

    st.divider()

    with st.form("contact_form", clear_on_submit=True):
        st.markdown("### 📧 Request a Quote")
        c_col1, c_col2 = st.columns(2)
        name = c_col1.text_input("Full Name *")
        email = c_col2.text_input("Corporate Email Address *")
        company = c_col1.text_input("Company Name")
        country = c_col2.text_input("Destination Country")
        message = st.text_area("Spices Required *")
        
        if st.form_submit_button("Submit Export Inquiry"):
            if not name or not email or not message:
                st.error("Please fill in all required (*) fields.")
            else:
                new_msg = {
                    "id": str(os.urandom(4).hex()), "name": name, "email": email, "company": company,
                    "country": country, "message": message, "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                data["messages"].insert(0, new_msg)
                save_data(data)
                st.success("Enquiry saved successfully.")

    st.markdown(f"""
        <div style="text-align: center; margin-top: 50px; padding: 20px; color: #888; font-size: 0.85em;">
            © {datetime.datetime.now().year} {s['brandName']} {s['brandSuffix']}. All rights reserved.<br>
            🏢 {s['address']} | 📞 {s['phone']} | ✉️ {s['email']}
        </div>
    """, unsafe_allow_html=True)

# ----------------------------------------------------------------------
# JOURNAL / BLOG VIEW
# ----------------------------------------------------------------------
elif view == "Journal / Blog":
    st.title("📰 The Trade Desk Journal")
    st.divider()
    for post in data["blogPosts"]:
        with st.expander(f"📌 [{post['tag']}] {post['title']} — {post['date']}"):
            st.markdown(f"**By: {post['author']}**")
            st.write(post["content"])

# ----------------------------------------------------------------------
# CONTROL ROOM (ADMIN PANEL)
# ----------------------------------------------------------------------
elif view == "Control Room Dashboard":
    st.title("🔒 Back-Office Control Room")
    
    if not st.session_state.authenticated:
        passcode_input = st.text_input("Enter Control Room Passcode Key", type="password")
        if st.button("Unlock Admin Dashboard"):
            if passcode_input == ADMIN_PASSCODE:
                st.session_state.authenticated = True
                st.rerun()
            else:
                st.error("Invalid Configuration Key Code.")
    else:
        if st.sidebar.button("🔒 Logout Admin Session"):
            st.session_state.authenticated = False
            st.rerun()
            
        admin_tab = st.tabs(["Design & Branding", "Site Metadata", "Manage Spices", "Sourcing Regions", "Trust Badges", "Journal Submissions", "Leads Inbox"])
        
        # NEW TAB: DESIGN & BRANDING
        with admin_tab[0]:
            st.subheader("Website Theme & Visual Branding Customization")
            with st.form("branding_form"):
                s['logoText'] = st.text_input("Logo Display Badge Letter/Text", s['logoText'], max_chars=3)
                s['primaryColor'] = st.color_picker("Primary Website Theme Color (Suffix text color)", s['primaryColor'])
                s['accentColor'] = st.color_picker("Accent Website Theme Color (Eyebrow labels)", s['accentColor'])
                
                if st.form_submit_button("Apply Theme and Logo Changes"):
                    save_data(data)
                    st.success("Visual styles updated successfully!")
                    st.rerun()
        
        # TAB 2: SITE SETTINGS
        with admin_tab[1]:
            st.subheader("Edit Core Site Content Data")
            with st.form("settings_form"):
                s['brandName'] = st.text_input("Brand Name", s['brandName'])
                s['brandSuffix'] = st.text_input("Brand Suffix Accent", s['brandSuffix'])
                s['tagline'] = st.text_input("Tagline Text", s['tagline'])
                s['heroEyebrow'] = st.text_input("Hero Segment Eyebrow", s['heroEyebrow'])
                s['heroTitle'] = st.text_area("Hero Main Headline Title", s['heroTitle'])
                s['heroSubtitle'] = st.text_area("Hero Context Copy Subtitle", s['heroSubtitle'])
                s['aboutTitle'] = st.text_input("About Header Title", s['aboutTitle'])
                s['aboutText'] = st.text_area("About Block Text Paragraphs", s['aboutText'])
                s['phone'] = st.text_input("Trading Phone Contact", s['phone'])
                s['email'] = st.text_input("Corporate Desk Email Address", s['email'])
                s['address'] = st.text_area("Physical Trade Desk Address", s['address'])
                
                if st.form_submit_button("Commit Global Metadata Modifications"):
                    save_data(data)
                    st.success("Core site copy updated live.")
                    
        # TAB 3: SPICES MANAGEMENT
        with admin_tab[2]:
            st.subheader("Add and Modify Global Spice Listings")
            with st.expander("➕ Add New Spice Product Item"):
                with st.form("add_spice_form", clear_on_submit=True):
                    n_name = st.text_input("Common Market Name")
                    n_latin = st.text_input("Botanical / Latin Profile Name")
                    n_cat = st.text_input("Commodity Category Classification", "Whole Spices")
                    n_hs = st.text_input("Harmonized Custom HS Code Classification")
                    n_orig = st.text_input("Domestic Harvest Production Origin Hub")
                    n_col = st.color_picker("Card Ribbon Highlight Color", "#D9971C")
                    n_desc = st.text_area("Detailed Quality Profile Specification")
                    
                    if st.form_submit_button("Append Product Item"):
                        if n_name:
                            new_item = {"id": str(os.urandom(4).hex()), "name": n_name, "latin": n_latin, "category": n_cat, "hsCode": n_hs, "origin": n_orig, "color": n_col, "description": n_desc}
                            data["products"].insert(0, new_item)
                            save_data(data)
                            st.success(f"{n_name} committed to registry.")
                            st.rerun()
            
            for idx, prod in enumerate(data["products"]):
                with st.container(border=True):
                    col_p1, col_p2 = st.columns([4, 1])
                    with col_p1:
                        st.markdown(f"#### Edit Card Record ID: `{prod['id']}` — **{prod['name']}**")
                    with col_p2:
                        if st.button("🗑️ Purge Entry", key=f"del_prod_{prod['id']}"):
                            data["products"].pop(idx)
                            save_data(data)
                            st.rerun()
                    prod['name'] = st.text_input("Market Name Mapping", prod['name'], key=f"name_{prod['id']}")
                    prod['category'] = st.text_input("Category", prod['category'], key=f"cat_{prod['id']}")
                    prod['hsCode'] = st.text_input("HS Code Label Reference", prod['hsCode'], key=f"hs_{prod['id']}")
                    prod['description'] = st.text_area("Item Specification Description Context", prod['description'], key=f"desc_{prod['id']}")
            if st.button("Save Spice Edits"):
                save_data(data)
                st.success("All updates committed.")

        # TAB 4: SOURCING REGIONS
        with admin_tab[3]:
            st.subheader("Sourcing Node Fields")
            for idx, reg in enumerate(data["regions"]):
                with st.container(border=True):
                    reg['state'] = st.text_input("State Jurisdiction", reg['state'], key=f"reg_s_{reg['id']}")
                    reg['hub'] = st.text_input("Hub Cluster Node", reg['hub'], key=f"reg_h_{reg['id']}")
                    reg['specialty'] = st.text_input("Crop Specialty Output", reg['specialty'], key=f"reg_sp_{reg['id']}")
                    reg['description'] = st.text_area("Logistic Context Data", reg['description'], key=f"reg_d_{reg['id']}")
            if st.button("Save Region Log Metrics Updates"):
                save_data(data)
                st.success("Region matrices updated.")

        # TAB 5: TRUST BADGES
        with admin_tab[4]:
            st.subheader("Alter Global Value Proposition Badges")
            for idx, feat in enumerate(data["features"]):
                with st.container(border=True):
                    feat['icon'] = st.text_input("Emoji Icon", feat['icon'], key=f"f_i_{feat['id']}")
                    feat['title'] = st.text_input("Header Title", feat['title'], key=f"f_t_{feat['id']}")
                    feat['description'] = st.text_area("Context Paragraph", feat['description'], key=f"f_d_{feat['id']}")
            if st.button("Synchronize Structural Badges Modifiers"):
                save_data(data)
                st.success("Value vectors updated.")

        # TAB 6: JOURNAL ENTRIES
        with admin_tab[5]:
            st.subheader("Publish Editorial Sourcing Advisory Updates logs")
            if st.button("📝 Create New Empty Journal Entry Template"):
                new_post = {
                    "id": str(os.urandom(4).hex()), "title": "New Spice Sourcing Insight Report Analysis",
                    "excerpt": "Brief market advisory summary indicator.", "content": "Comprehensive editorial content paragraphs.",
                    "date": datetime.date.today().strftime('%Y-%m-%d'), "author": "Aksh Wyndham Analytics Desk", "tag": "Market Advisory"
                }
                data["blogPosts"].insert(0, new_post)
                save_data(data)
                st.rerun()
                
            for idx, post in enumerate(data["blogPosts"]):
                with st.expander(f"✍️ Edit Article Structural Node: {post['title']}"):
                    post['title'] = st.text_input("Editorial Article Headline", post['title'], key=f"bp_t_{post['id']}")
                    post['tag'] = st.text_input("Categorization Tag Tracker Label", post['tag'], key=f"bp_tg_{post['id']}")
                    post['excerpt'] = st.text_input("Article Meta Excerpt", post['excerpt'], key=f"bp_e_{post['id']}")
                    post['content'] = st.text_area("Main Article Copy Document", post['content'], key=f"bp_c_{post['id']}", height=150)
                    if st.button("🗑️ Destroy Article Instance", key=f"del_bp_{post['id']}"):
                        data["blogPosts"].pop(idx)
                        save_data(data)
                        st.rerun()
            if st.button("Save Journal Submissions Changes"):
                save_data(data)
                st.success("Journal assets matrix updated.")

        # TAB 7: LEADS INBOX
        with admin_tab[6]:
            st.subheader("📥 Incoming Importer Lead Request Ledger Inbox")
            if not data["messages"]:
                st.info("No customer inquiries recorded in database yet.")
            else:
                for idx, msg in enumerate(data["messages"]):
                    with st.chat_message("user"):
                        st.markdown(f"**From Lead:** {msg['name']} ({msg.get('company', 'N/A')}) — {msg.get('country', 'N/A')}")
                        st.caption(f"📅 Timestamp Logged: {msg['date']} | ✉️ Contact Email Link: {msg['email']}")
                        st.write(f"💬 **Inquiry Specifications:** {msg['message']}")
                        if st.button("🗑️ Archive Request Entry Lead Node Instance", key=f"del_msg_{msg['id']}"):
                            data["messages"].pop(idx)
                            save_data(data)
                            st.rerun()
