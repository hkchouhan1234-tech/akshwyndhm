import streamlit as st
import json
import os
from datetime import datetime

# Set page config for a wide layout and clean look
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
        "instagram": "https://www.instagram.com/aksh.wyndham"
    },
    "products": [
        {"id": "p1", "name": "Turmeric", "latin": "Curcuma longa", "category": "Whole & Powder", "hsCode": "0910 30", "origin": "Andhra Pradesh & Tamil Nadu", "color": "#D9971C", "description": "High-curcumin turmeric fingers and powder, sun-dried and polished, available in Salem, Erode and Nizamabad grades."},
        {"id": "p2", "name": "Red Chilli", "latin": "Capsicum annuum", "category": "Whole & Powder", "hsCode": "0904 21", "origin": "Guntur, Andhra Pradesh", "color": "#A6321D", "description": "Guntur Sannam and Teja varieties, graded for colour value and pungency, whole pods or fine powder."},
        {"id": "p3", "name": "Black Pepper", "latin": "Piper nigrum", "category": "Whole Spices", "hsCode": "0904 11", "origin": "Idukki & Wayanad, Kerala", "color": "#3B3226", "description": "Malabar garbled black pepper, steam-sterilised, 500-570 g/l bulk density on request."},
        {"id": "p4", "name": "Green Cardamom", "latin": "Elettaria cardamomum", "category": "Whole Spices", "hsCode": "0908 31", "origin": "Idukki, Kerala", "color": "#4B5D3A", "description": "Bold, hand-picked 7mm+ and 8mm+ cardamom from Kerala's high ranges, auction-sourced and re-graded."},
        {"id": "p5", "name": "Cumin Seeds", "latin": "Cuminum cyminum", "category": "Seeds", "hsCode": "0909 31", "origin": "Unjha, Gujarat", "color": "#B8892B", "description": "Singapore-quality cumin from the Unjha mandi, machine-cleaned to under 1% admixture."},
        {"id": "p6", "name": "Coriander Seeds", "latin": "Coriandrum sativum", "category": "Seeds", "hsCode": "0909 21", "origin": "Rajasthan & Gujarat", "color": "#8A8C4F", "description": "Eagle and split coriander, high volatile-oil content, sourced direct from Rajasthan mandis."}
    ],
    "regions": [
        {"id": "r1", "state": "Gujarat", "hub": "Unjha Mandi", "specialty": "Cumin, fennel & fenugreek", "description": "Asia's largest spice trading market — our home base for seed spices, sourced within a day of auction."},
        {"id": "r2", "state": "Rajasthan", "hub": "Kota & Baran", "specialty": "Coriander & fenugreek", "description": "Arid-belt growing regions producing high-oil-content coriander prized by European buyers."},
        {"id": "r3", "state": "Kerala", "hub": "Idukki Highlands", "specialty": "Cardamom & black pepper", "description": "The original Malabar spice coast — cool hill estates producing India's finest cardamom and pepper."}
    ],
    "features": [
        {"id": "f1", "icon": "🛡️", "title": "Lab-tested, every lot", "description": "Independent lab reports for pesticide residue, aflatoxin and microbial load accompany every shipment."},
        {"id": "f2", "icon": "🚢", "title": "Full export documentation", "description": "Phytosanitary certificates, certificate of origin, fumigation and FSSAI paperwork handled in-house."},
        {"id": "f3", "icon": "🌐", "title": "40+ countries served", "description": "Established lanes to the Middle East, Europe, North America and Southeast Asia, FCL and LCL."}
    ],
    "blogPosts": [
        {
            "id": "b1",
            "title": "Guntur chilli: why Andhra's red gold leads global demand",
            "excerpt": "A look at what makes Guntur Sannam and Teja chillies the benchmark grade for importers worldwide.",
            "content": "Guntur, in Andhra Pradesh, produces some of the most sought-after chilli varieties in the world. Sannam chillies are prized for their deep red colour value, while Teja varieties bring higher pungency for markets that want more heat.\n\nColour value and Scoville rating are tested on every lot before it leaves our warehouse, and we hold back stock that doesn't meet the grade a buyer has ordered rather than substitute a lower grade at the same price.",
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

# Load into session state if not existing
if "site_data" not in st.session_state:
    st.session_state.site_data = load_data()
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

data = st.session_state.site_data
s = data["settings"]

# ----------------------------------------------------------------------
# APP NAVIGATION CONTROLS
# ----------------------------------------------------------------------
st.sidebar.markdown(f"## 🌶️ {s['brandName']} Control Desk")
view = st.sidebar.radio("Navigate View", ["Main Website", "Journal / Blog", "Control Room Dashboard"])

# ----------------------------------------------------------------------
# MAIN WEBSITE VIEW
# ----------------------------------------------------------------------
if view == "Main Website":
    # Hero Section
    st.markdown(f"<p style='text-transform: uppercase; letter-spacing: 0.15em; color: #D9971C; font-weight: bold;'>{s['heroEyebrow']} · Est. {s['established']}</p>", unsafe_allow_html=True)
    st.title(s['heroTitle'])
    st.subheader(s['heroSubtitle'])
    
    # Hero Quick Stats
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Countries Served", s['countries'])
    col2.metric("Spice Varieties", s['varieties'])
    col3.metric("Exported Yearly", s['tonnage'])
    col4.metric("Trading Since", s['established'])
    
    st.divider()

    # About Section
    st.markdown(f"### 📍 {s['aboutEyebrow']}")
    st.markdown(f"## {s['aboutTitle']}")
    for paragraph in s['aboutText'].split("\n\n"):
        st.write(paragraph)
        
    st.divider()

    # Products Catalogue
    st.markdown("### 📦 Our Spice Catalogue")
    categories = ["All"] + list(set(p["category"] for p in data["products"]))
    selected_category = st.selectbox("Filter Categories", categories)
    
    filtered_products = data["products"] if selected_category == "All" else [p for p in data["products"] if p["category"] == selected_category]
    
    prod_cols = st.columns(3)
    for index, p in enumerate(filtered_products):
        with prod_cols[index % 3]:
            st.markdown(
                f"""
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 5px solid {p['color']}; margin-bottom: 20px;">
                    <span style="float: right; font-size: 0.8em; background-color: #ddd; padding: 2px 8px; border-radius: 10px;">HS {p['hsCode']}</span>
                    <h3>{p['name']}</h3>
                    <p><i>{p['latin']}</i></p>
                    <p>{p['description']}</p>
                    <p style="font-size: 0.9em; color: #555;">📍 <b>Origin:</b> {p['origin']}</p>
                </div>
                """, unsafe_allow_html=True
            )

    st.divider()

    # Sourcing Regions
    st.markdown("### 🗺️ Spice Route Sourcing Hubs")
    reg_cols = st.columns(len(data["regions"]))
    for index, r in enumerate(data["regions"]):
        with reg_cols[index]:
            st.info(f"**{r['state']}** ({r['hub']})\n\n🌟 *{r['specialty']}*\n\n{r['description']}")

    st.divider()

    # Trust Features
    st.markdown("### ✨ Built for Global Quality Buyers")
    feat_cols = st.columns(len(data["features"]))
    for index, f in enumerate(data["features"]):
        with feat_cols[index]:
            st.success(f"### {f['icon']} {f['title']}\n{f['description']}")

    st.divider()

    # Public Contact Form
    st.markdown("### 📧 Request a Quote / Sample Portfolio")
    with st.form("contact_form", clear_on_submit=True):
        c_col1, c_col2 = st.columns(2)
        name = c_col1.text_input("Full Name *")
        email = c_col2.text_input("Corporate Email Address *")
        company = c_col1.text_input("Company Name")
        country = c_col2.text_input("Destination Country")
        message = st.text_area("Spices Required, Estimated Tonnage & Destination Port *")
        
        submit_btn = st.form_submit_button("Submit Export Inquiry")
        if submit_btn:
            if not name or not email or not message:
                st.error("Please fill in all required (*) fields.")
            else:
                new_msg = {
                    "id": str(os.urandom(4).hex()),
                    "name": name,
                    "email": email,
                    "company": company,
                    "country": country,
                    "message": message,
                    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                data["messages"].insert(0, new_msg)
                save_data(data)
                st.success("Enquiry recorded safely! Our global export desk loops back within 1 business day.")

    # Footer Setup
    st.markdown(
        f"""
        <div style="text-align: center; margin-top: 50px; padding: 20px; color: #888; font-size: 0.85em;">
            © {datetime.now().year} {s['brandName']} {s['brandSuffix']}. All rights reserved. <br>
            🏢 {s['address']} | 📞 {s['phone']} | ✉️ {s['email']}
        </div>
        """, unsafe_allow_html=True
    )

# ----------------------------------------------------------------------
# JOURNAL / BLOG VIEW
# ---------------------------------------------------------------------
elif view == "Journal / Blog":
    st.title("📰 The Trade Desk Journal")
    st.markdown("Market analytics, logistics blueprints, and sourcing compliance field logs directly from India.")
    st.divider()
    
    for post in data["blogPosts"]:
        with st.expander(f"📌 [{post['tag']}] {post['title']} — {post['date']}"):
            st.markdown(f"**By: {post['author']}**")
            st.caption(post["excerpt"])
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
            
        admin_tab = st.tabs(["Site Metadata", "Manage Spices", "Sourcing Regions", "Trust Badges", "Journal Submissions", "Inbound Leads Inbox"])
        
        # TAB 1: SITE SETTINGS
        with admin_tab[0]:
            st.subheader("Edit Core Site Elements")
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
                    st.success("Site configuration adjusted updates processed live.")
                    
        # TAB 2: SPICES MANAGEMENT
        with admin_tab[1]:
            st.subheader("Add and Modify Global Spice Listings")
            
            # Form to add a spice
            with st.expander("➕ Add New Spice Product Item"):
                with st.form("add_spice_form", clear_on_submit=True):
                    n_name = st.text_input("Common Market Name")
                    n_latin = st.text_input("Botanical / Latin Profile Name")
                    n_cat = st.text_input("Commodity Category Classification", "Whole Spices")
                    n_hs = st.text_input("Harmonized Custom HS Code Classification")
                    n_orig = st.text_input("Domestic Harvest Production Origin Hub")
                    n_col = st.color_picker("Brand Grid UI Highlight Color Accent", "#D9971C")
                    n_desc = st.text_area("Detailed Quality Profile Specification & Moisture Metrics Descriptions")
                    
                    if st.form_submit_button("Append Product Item to Active Master Matrix"):
                        if n_name:
                            new_item = {"id": str(os.urandom(4).hex()), "name": n_name, "latin": n_latin, "category": n_cat, "hsCode": n_hs, "origin": n_orig, "color": n_col, "description": n_desc}
                            data["products"].insert(0, new_item)
                            save_data(data)
                            st.success(f"{n_name} committed to database registry successfully.")
                            st.rerun()
            
            # Existing entries edit / delete mechanics
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

        # TAB 3: REGIONS SOURCING
        with admin_tab[2]:
            st.subheader("Manage Global Supply Hub Production Sourcing Nodes")
            for idx, reg in enumerate(data["regions"]):
                with st.container(border=True):
                    reg['state'] = st.text_input("State Jurisdiction Sourcing Territory", reg['state'], key=f"reg_s_{reg['id']}")
                    reg['hub'] = st.text_input("Regional Market Hub Cluster Node", reg['hub'], key=f"reg_h_{reg['id']}")
                    reg['specialty'] = st.text_input("Regional Crop Specialty Focal Output", reg['specialty'], key=f"reg_sp_{reg['id']}")
                    reg['description'] = st.text_area("Infrastructure Facility Logistic Context Data", reg['description'], key=f"reg_d_{reg['id']}")
            if st.button("Save Region Log Metrics Updates"):
                save_data(data)
                st.success("Region matrices re-aligned updates locked down.")

        # TAB 4: TRUST BADGES
        with admin_tab[3]:
            st.subheader("Alter Global Value Proposition Badges")
            for idx, feat in enumerate(data["features"]):
                with st.container(border=True):
                    feat['icon'] = st.text_input("System Grid UI Display Emoji Accent Indicator", feat['icon'], key=f"f_i_{feat['id']}")
                    feat['title'] = st.text_input("Assertion Proposition Header Title", feat['title'], key=f"f_t_{feat['id']}")
                    feat['description'] = st.text_area("Validation Quality Standards Context Paragraph", feat['description'], key=f"f_d_{feat['id']}")
            if st.button("Synchronize Structural Badges Modifiers"):
                save_data(data)
                st.success("Value vectors preserved updates deployed.")

        # TAB 5: JOURNAL ENTRIES
        with admin_tab[4]:
            st.subheader("Publish Editorial Sourcing Advisory Updates logs")
            if st.button("📝 Create New Empty Journal Entry Template"):
                new_post = {
                    "id": str(os.urandom(4).hex()),
                    "title": "New Spice Sourcing Insight Report Analysis",
                    "excerpt": "Brief market advisory summary indicator outline tracking parameters data profiles.",
                    "content": "Comprehensive editorial content paragraphs detailing field operations evaluations metrics.",
                    "date": datetime.today().strftime('%Y-%m-%d'),
                    "author": "Aksh Wyndham Analytics Desk",
                    "tag": "Market Advisory"
                }
                data["blogPosts"].insert(0, new_post)
                save_data(data)
                st.rerun()
                
            for idx, post in enumerate(data["blogPosts"]):
                with st.expander(f"✍️ Edit Article Structural Node: {post['title']}"):
                    post['title'] = st.text_input("Editorial Article Headline Header", post['title'], key=f"bp_t_{post['id']}")
                    post['tag'] = st.text_input("Categorization Tag Tracker Label", post['tag'], key=f"bp_tg_{post['id']}")
                    post['excerpt'] = st.text_input("Article Meta Excerpt Card Description", post['excerpt'], key=f"bp_e_{post['id']}")
                    post['content'] = st.text_area("Main Article Copy Document Structure Context Lines", post['content'], key=f"bp_c_{post['id']}", height=250)
                    if st.button("🗑️ Destroy Article Instance", key=f"del_bp_{post['id']}"):
                        data["blogPosts"].pop(idx)
                        save_data(data)
                        st.rerun()
            if st.button("Save Journal Submissions Changes"):
                save_data(data)
                st.success("Journal assets matrix consolidated updates live.")

        # TAB 6: MESSAGES LEADS INBOX
        with admin_tab[5]:
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
                            st.success("Lead cleared.")
                            st.rerun()