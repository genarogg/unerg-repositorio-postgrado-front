import { Search as Lupita } from "lucide-react"
import "../css/search.css"
import { useGlobalFilter } from "../../../../context/Global"

interface SearchProps { }

const Search: React.FC<SearchProps> = () => {

    const { getSearch, setSearch } = useGlobalFilter();
    const searchValue = getSearch();

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    return (
        <div className="table-search-container">
            <Lupita className="table-search-icon" size={20} />
            <input
                type="text"
                placeholder="Buscar elementos..."
                className="table-search-input"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}

export default Search;
