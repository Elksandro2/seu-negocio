import { useState, useEffect } from 'react';
import { OrderService } from '../../services/OrderService';
import { BusinessService } from '../../services/BusinessService';
import { CurrencyDollar, ReceiptCutoff, ExclamationTriangle, ExclamationCircle } from 'react-bootstrap-icons';
import Loading from '../../components/Loading';
import styles from './styles.module.css';
import CardGraphic from '../../components/CardGraphic'; 
import { Col, Row } from 'react-bootstrap';
import TopProductsList from '../../components/TopProductsList';

export default function DashboardSeller() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lowStockCount, setLowStockCount] = useState(0);

    const orderService = new OrderService();
    const businessService = new BusinessService();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);

            const ordersResponse = await orderService.getSellerOrders();
            
            if (ordersResponse.success) {
                setOrders(ordersResponse.data);
            } else {
                console.error("Erro ao buscar pedidos do vendedor:", ordersResponse.message);
            }

            const businessResponse = await businessService.getMyBusinesses();
            if (businessResponse.success) {
                const allItems = businessResponse.data.flatMap((b) => b.items || []);
                
                const lowStockItems = allItems.filter(item => 
                    item.offerType === 'PRODUCT' && item.stockQuantity <= 5
                );
                
                setLowStockCount(lowStockItems.length);
            }

            setIsLoading(false);
        };

        fetchDashboardData();
    }, []);

    if (isLoading) return <Loading />;
    
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrdersCount = orders.length;

    const productSalesMap = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productSalesMap[item.itemId]) {
                productSalesMap[item.itemId] = {
                    id: item.itemId,
                    name: item.itemName,
                    imageUrl: item.itemImageUrl,
                    businessName: order.businessName,
                    quantitySold: 0
                };
            }
            productSalesMap[item.itemId].quantitySold += item.quantity;
        });
    });

    const topSellingProducts = Object.values(productSalesMap)
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 5);

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Painel do Vendedor</h1>
                <p className={styles.subtitle}>Acompanhe o desempenho da sua loja e gerencie seus pedidos.</p>
            </div>

            <Row className="mb-4">
                <Col md={4}>
                    <CardGraphic 
                        description="Total em Vendas" 
                        value={`R$ ${totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        icon={<CurrencyDollar size={24} />} 
                        color="#28a745"
                    />
                </Col>
                <Col md={4}>
                    <CardGraphic 
                        description="Quantidade de Pedidos" 
                        value={totalOrdersCount} 
                        icon={<ReceiptCutoff size={24} />} 
                        color="#0d6efd"
                    />
                </Col>
                <Col md={4}>
                    <CardGraphic
                        description="Produtos c/ Estoque Baixo"
                        value={lowStockCount}
                        icon={<ExclamationCircle size={24} />}
                        color="#be0e0e"
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <TopProductsList products={topSellingProducts} />
                </Col>
            </Row>
        </div>
    );
}