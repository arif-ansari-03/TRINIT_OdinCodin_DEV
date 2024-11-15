import "./dashboardob.css"
import  Preview from "./Preview"

function DashboardOB() {
  return (
    <div>
        <div class="dashboardbar">
            <button class="logoutbutton">
                logout
            </button>
        </div>
        <div>
            Owned
            <div class="boardlist">
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
            </div>
        </div>
        <div>
            Shared
            <div class="boardlist">
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
            </div>
        </div>
        <div>
            Bookmarked
            <div class="boardlist">
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
                <Preview text="HI"/>
            </div>
        </div>
    </div>
  );
}

export default DashboardOB;
