import { useState, useEffect } from "react";
import { BusinessService } from "../../services/BusinessService";
import { ItemService } from "../../services/ItemService";
import { getStockStatus } from "../../utils/inventoryUtils";
import InventoryFilters from "../../components/InventoryFilters";
import QuantityControl from "../../components/QuantityControl";
import StockBadge from "../../components/StockBadge";
import Loading from "../../components/Loading";
import MessagePopUp from "../../components/MessagePopUp";
import styles from "./styles.module.css";

const businessService = new BusinessService();
const itemService = new ItemService();

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showMessagePopUp, setShowMessagePopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [severity, setSeverity] = useState("danger");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);

    const response = await businessService.getMyBusinesses();

    if (response.success && response.data) {
      const allItems = response.data.flatMap((b) => b.items || []);
      setItems(allItems);
    } else {
      setPopUpMessage(response.message || "Erro ao carregar o estoque.");
      setSeverity("danger");
      setShowMessagePopUp(true);
    }

    setLoading(false);
  };

  const handleStockUpdate = async (itemId, newQuantity) => {
    const response = await itemService.updateItemStock(itemId, newQuantity);

    if (response.success) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, stockQuantity: newQuantity } : item,
        ),
      );
    } else {
      setPopUpMessage(response.message || "Erro ao atualizar a quantidade.");
      setSeverity("danger");
      setShowMessagePopUp(true);
      loadInventory();
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      getStockStatus(item.stockQuantity) === filterStatus;
    return matchesSearch && matchesFilter && item.offerType === "PRODUCT";
  });

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciamento de Estoque</h1>
        <p className={styles.subtitle}>
          Acompanhe e atualize a quantidade dos seus produtos rapidamente.
        </p>
      </div>

      <InventoryFilters
        onFilterChange={setFilterStatus}
        onSearchChange={setSearchQuery}
      />

    <table className={styles.table}>
        <thead>
        <tr>
            <th>Produto</th>
            <th>Nome do Item</th>
            <th>Preço Atual</th>
            <th>Quantidade (Un.)</th>
            <th>Status</th>
        </tr>
        </thead>
        <tbody>
        {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
            <tr key={item.id}>
                <td>
                <img
                    src={item.imageUrls?.[0]}
                    alt={item.name}
                    className={styles.productImage}
                />
                </td>
                <td className={styles.productName}>{item.name}</td>
                <td className={styles.productPrice}>
                R$ {item.price?.toFixed(2).replace(".", ",")}
                </td>
                <td>
                <QuantityControl
                    initialQuantity={item.stockQuantity || 0}
                    onQuantityChange={(newQty) =>
                    handleStockUpdate(item.id, newQty)
                    }
                />
                </td>
                <td>
                <StockBadge quantity={item.stockQuantity || 0} />
                </td>
            </tr>
            ))
        ) : (
            <tr>
            <td colSpan="5" className={styles.emptyMessage}>
                Nenhum item encontrado com estes filtros.
            </td>
            </tr>
        )}
        </tbody>
    </table>

      {showMessagePopUp && (
        <MessagePopUp
          message={popUpMessage}
          showPopUp={setShowMessagePopUp}
          severity={severity}
        />
      )}
    </div>
  );
}
