import { isMobile } from "../helpers"
import './BiblegramHeader.css';

function BiblegramHeader() {
    return (
        <div className={`${isMobile() ? `mobile-biblegram-header`: `biblegram-header`}`}>
            <nav>
                <h1>Biblegram</h1>
            </nav>
        </div>
    )
}

export default BiblegramHeader
