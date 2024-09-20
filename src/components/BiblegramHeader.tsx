import { isMobile } from "../helpers"
import './BiblegramHeader.css';
import BiblegramNavigationBar from "./BiblegramNavigationBar";

function BiblegramHeader() {
    return (
        <div className={`${isMobile() ? `mobile-biblegram-header`: `biblegram-header`}`}>
            <BiblegramNavigationBar/>
            <h1>Biblegram</h1>
        </div>
    )
}

export default BiblegramHeader
