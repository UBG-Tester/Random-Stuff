import streamlit as st

# Configure the app structure
st.set_page_config(
    page_title="Text Editor & Viewer", 
    page_icon="📝", 
    layout="centered"
)

st.title("📝 Text Workspace")
st.write("Upload, read, search, or edit your text files in one place.")

# File Uploader Widget
uploaded_file = st.file_uploader("Choose a .txt file", type=["txt"])

if uploaded_file is not None:
    # Read and decode the text once, caching it in the session state
    if "file_content" not in st.session_state or st.session_state.get("last_uploaded") != uploaded_file.name:
        st.session_state["file_content"] = uploaded_file.read().decode("utf-8")
        st.session_state["last_uploaded"] = uploaded_file.name

    # Sidebar mode selection
    mode = st.sidebar.radio("Select Workspace Mode:", ["👀 Viewer Mode", "✏️ Editor Mode"])

    # ================= CONTEXT: VIEWER MODE =================
    if mode == "👀 Viewer Mode":
        st.subheader("File Viewer")
        search_query = st.text_input("🔍 Search text inside the file:")
        
        st.divider()
        
        if search_query:
            # Highlight matching text using HTML container formatting
            highlighted_text = st.session_state["file_content"].replace(
                search_query, 
                f'<mark style="background-color: yellow; color: black;">{search_query}</mark>'
            )
            st.markdown(
                f'<pre style="white-space: pre-wrap; font-family: monospace; border: 1px solid #ccc; padding: 15px; border-radius: 5px;">{highlighted_text}</pre>', 
                unsafe_allow_html=True
            )
        else:
            # Standard formatting if no search query is typed
            st.code(st.session_state["file_content"], language="text", wrap_lines=True)

    # ================= CONTEXT: EDITOR MODE =================
    elif mode == "✏️ Editor Mode":
        st.subheader("File Editor")
        
        # Interactive editing canvas
        edited_text = st.text_area(
            "Modify your text below:", 
            value=st.session_state["file_content"], 
            height=400
        )
        
        # Update session state with the modifications
        st.session_state["file_content"] = edited_text
        
        # Determine download filename
        original_name = uploaded_file.name
        new_name = original_name.replace(".txt", "_edited.txt") if ".txt" in original_name else "edited_file.txt"
        
        # Live Export/Download button
        st.download_button(
            label="💾 Download Edited File",
            data=edited_text,
            file_name=new_name,
            mime="text/plain"
        )
        
else:
    st.info("Please upload a .txt file to unlock the viewer and editor.")
