import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  InputGroup,
  Navbar,
  Spinner,
  Badge,
  ProgressBar,
  Button,
  Dropdown,
  Tab,
  Tabs,
  Nav,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2,
  FiPieChart,
  FiFilter,
  FiRefreshCw,
  FiHeart,
  FiBell,
  FiUser,
  FiHome,
  FiBriefcase,
  FiBookmark,
  FiAlertCircle,
  FiSettings,
} from "react-icons/fi";
import {
  mockCryptoData,
  marketStats,
  formatPrice,
  formatLargeNumber,
  formatPercentage,
} from "../data";
import { Link, useNavigate } from "react-router-dom";

const CryptoDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "market_cap",
    direction: "desc",
  });
  const [watchlist, setWatchlist] = useState([]);
  const [timeRange, setTimeRange] = useState("24h");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(localStorage.getItem("cryptoAuthToken") !== null);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredCrypto = mockCryptoData
    .filter((crypto) => {
      const matchesSearch =
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "gainers" && crypto.price_change_percentage_24h > 0) ||
        (activeTab === "losers" && crypto.price_change_percentage_24h < 0) ||
        (activeTab === "watchlist" && watchlist.includes(crypto.id));
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const toggleWatchlist = (id) => {
    if (!isLoggedIn) {
      navigate("/giris");
      return;
    }
    
    if (watchlist.includes(id)) {
      setWatchlist(watchlist.filter((item) => item !== id));
    } else {
      setWatchlist([...watchlist, id]);
    }
  };

  const SortableHeader = ({ label, sortKey }) => (
    <th
      onClick={() => requestSort(sortKey)}
      style={{ cursor: "pointer" }}
      className="user-select-none"
    >
      {label}
      {sortConfig.key === sortKey && (
        <span className="ms-1">
          {sortConfig.direction === "asc" ? "↑" : "↓"}
        </span>
      )}
    </th>
  );

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("cryptoAuthToken");
      setIsLoggedIn(false);
      setWatchlist([]);
    } else {
      navigate("/giris");
    }
  };

  return (
    <div className="crypto-dashboard bg-light">
      {/* Navigasyon Çubuğu */}
      <Navbar
        bg="primary"
        variant="dark"
        expand="lg"
        sticky="top"
        className="shadow-sm"
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <FiTrendingUp className="me-2" size={24} />
            <span className="fw-bold">CryptoVision</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-search" />

          <Navbar.Collapse id="navbar-search">
            <div className="d-flex flex-column flex-lg-row w-100 align-items-lg-center">
              <Nav className="me-lg-3 mb-2 mb-lg-0">
                <Nav.Link as={Link} to="/" className="d-flex align-items-center">
                  <FiHome className="me-1" />
                  <span className="d-none d-lg-inline">Anasayfa</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/piyasalar" className="d-flex align-items-center">
                  <FiBarChart2 className="me-1" />
                  <span className="d-none d-lg-inline">Piyasalar</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/portfoy" className="d-flex align-items-center">
                  <FiBriefcase className="me-1" />
                  <span className="d-none d-lg-inline">Portföy</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/haberler" className="d-flex align-items-center">
                  <FiAlertCircle className="me-1" />
                  <span className="d-none d-lg-inline">Haberler</span>
                </Nav.Link>
              </Nav>

              <Form className="me-lg-3 mb-2 mb-lg-0 flex-grow-1">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Bitcoin, ETH ara..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 shadow-none bg-dark text-light"
                  />
                  <InputGroup.Text className="bg-dark border-0">
                    <FiSearch className="text-secondary" />
                  </InputGroup.Text>
                </InputGroup>
              </Form>

              <div className="d-flex">
                <Button
                  variant="outline-light"
                  size="sm"
                  className="me-2 d-flex align-items-center"
                  onClick={() => window.location.reload()}
                >
                  <FiRefreshCw size={16} className="me-1" />
                  <span className="d-none d-lg-inline">Yenile</span>
                </Button>

                <Dropdown className="me-2">
                  <Dropdown.Toggle
                    variant="outline-light"
                    size="sm"
                    id="time-range-dropdown"
                  >
                    {timeRange === "24h"
                      ? "24s"
                      : timeRange === "7d"
                      ? "7g"
                      : "1s"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      active={timeRange === "1h"}
                      onClick={() => setTimeRange("1h")}
                    >
                      1 Saat
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={timeRange === "24h"}
                      onClick={() => setTimeRange("24h")}
                    >
                      24 Saat
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={timeRange === "7d"}
                      onClick={() => setTimeRange("7d")}
                    >
                      7 Gün
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                  as={Link}
                  to="/bildirimler"
                >
                  <FiBell size={16} />
                </Button>

                <Dropdown>
                  <Dropdown.Toggle variant="outline-light" size="sm">
                    <FiUser size={16} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {isLoggedIn ? (
                      <>
                        <Dropdown.Item as={Link} to="/profil">
                          Profilim
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/ayarlar">
                          <FiSettings className="me-1" />
                          Ayarlar
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleAuthAction}>
                          Çıkış Yap
                        </Dropdown.Item>
                      </>
                    ) : (
                      <>
                        <Dropdown.Item as={Link} to="/giris">
                          Giriş Yap
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/kayit">
                          Kayıt Ol
                        </Dropdown.Item>
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Ana İçerik */}
      <Container fluid className="py-3 px-lg-4">
        {/* Piyasa Genel Bakış Bölümü */}
        <Row className="g-3 mb-4">
          <Col xl={3} lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="bg-gradient-primary text-white rounded-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-circle me-3">
                    <FiDollarSign size={24} />
                  </div>
                  <div>
                    <Card.Title className="mb-1 small text-uppercase fw-bold opacity-75">
                      Toplam Piyasa Değeri
                    </Card.Title>
                    <h4 className="mb-0">
                      {formatPrice(marketStats.totalMarketCap)}
                    </h4>
                    <div className="small mt-1">
                      <FiTrendingUp className="me-1" />
                      +2.5% (24s)
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="bg-gradient-success text-white rounded-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-circle me-3">
                    <FiBarChart2 size={24} />
                  </div>
                  <div>
                    <Card.Title className="mb-1 small text-uppercase fw-bold opacity-75">
                      24s Hacim
                    </Card.Title>
                    <h4 className="mb-0">
                      {formatPrice(marketStats.totalVolume24h)}
                    </h4>
                    <div className="small mt-1">
                      <FiTrendingUp className="me-1" />
                      +12.3% (24s)
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="bg-gradient-warning text-white rounded-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-circle me-3">
                    <FiPieChart size={24} />
                  </div>
                  <div>
                    <Card.Title className="mb-1 small text-uppercase fw-bold opacity-75">
                      BTC Hakimiyeti
                    </Card.Title>
                    <h4 className="mb-0">{marketStats.btcDominance}%</h4>
                    <div className="small mt-1">
                      <FiTrendingUp
                        className="me-1"
                        style={{ transform: "rotate(180deg)" }}
                      />
                      -0.8% (24s)
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="bg-gradient-info text-white rounded-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-circle me-3">
                    <FiStar size={24} />
                  </div>
                  <div>
                    <Card.Title className="mb-1 small text-uppercase fw-bold opacity-75">
                      Aktif Kriptolar
                    </Card.Title>
                    <h4 className="mb-0">
                      {formatLargeNumber(marketStats.activeCryptocurrencies)}
                    </h4>
                    <div className="small mt-1 opacity-75">
                      +{marketStats.upcomingIcos} yaklaşan ICO
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Kripto Tablo Bölümü */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-0 py-3">
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="mb-0 fw-bold">Kripto Para Piyasası</h5>
              </Col>
              <Col md={6} className="text-end">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="d-inline-flex"
                >
                  <Tab eventKey="all" title="Tümü" className="border-0" />
                  <Tab eventKey="gainers" title="Yükselenler" />
                  <Tab eventKey="losers" title="Düşenler" />
                  <Tab
                    eventKey="watchlist"
                    title="Takip Listesi"
                    disabled={watchlist.length === 0}
                  />
                </Tabs>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Piyasa verileri yükleniyor...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th width="40px"></th>
                      <th width="5%">#</th>
                      <SortableHeader label="Coin" sortKey="name" width="20%" />
                      <SortableHeader
                        label="Fiyat"
                        sortKey="current_price"
                        width="15%"
                      />
                      <SortableHeader
                        label={
                          timeRange === "24h"
                            ? "24s"
                            : timeRange === "7d"
                            ? "7g"
                            : "1s"
                        }
                        sortKey={`price_change_percentage_${timeRange}`}
                        width="15%"
                      />
                      <SortableHeader
                        label="Piyasa Değeri"
                        sortKey="market_cap"
                        width="15%"
                      />
                      <SortableHeader
                        label="Hacim (24s)"
                        sortKey="volume_24h"
                        width="15%"
                      />
                      <th width="10%">Grafik (7g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrypto.map((crypto, index) => (
                      <tr
                        key={crypto.id}
                        className={
                          watchlist.includes(crypto.id) ? "table-warning" : ""
                        }
                      >
                        <td>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-warning"
                            onClick={() => toggleWatchlist(crypto.id)}
                          >
                            <FiHeart
                              fill={
                                watchlist.includes(crypto.id)
                                  ? "#ffc107"
                                  : "none"
                              }
                            />
                          </Button>
                        </td>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              width="24"
                              height="24"
                              className="me-2 rounded-circle"
                            />
                            <div>
                              <div className="fw-bold">
                                <Link to={`/coin/${crypto.id}`} className="text-decoration-none text-dark">
                                  {crypto.name}
                                </Link>
                              </div>
                              <div className="text-muted text-uppercase small">
                                {crypto.symbol}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="fw-bold">
                          {formatPrice(crypto.current_price)}
                        </td>
                        <td>
                          <Badge
                            pill
                            bg={
                              crypto.price_change_percentage_24h >= 0
                                ? "success"
                                : "danger"
                            }
                            className="px-3 py-2 d-inline-flex align-items-center"
                          >
                            {crypto.price_change_percentage_24h >= 0 ? (
                              <FiTrendingUp size={14} className="me-1" />
                            ) : (
                              <FiTrendingUp
                                size={14}
                                className="me-1"
                                style={{ transform: "rotate(180deg)" }}
                              />
                            )}
                            {formatPercentage(
                              crypto.price_change_percentage_24h
                            )}
                          </Badge>
                        </td>
                        <td>{formatPrice(crypto.market_cap)}</td>
                        <td>{formatPrice(crypto.volume_24h)}</td>
                        <td>
                          <Link to={`/coin/${crypto.id}/grafik`}>
                            <svg
                              width="100"
                              height="40"
                              viewBox="0 0 120 40"
                              className="sparkline"
                            >
                              <path
                                d={crypto.sparkline}
                                fill="none"
                                stroke={
                                  crypto.price_change_percentage_7d >= 0
                                    ? "#28a745"
                                    : "#dc3545"
                                }
                                strokeWidth="2"
                              />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>

          <Card.Footer className="bg-white border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                {mockCryptoData.length} coinden {filteredCrypto.length} tanesi gösteriliyor
              </div>
              <div>
                <Button variant="outline-primary" size="sm" className="me-2">
                  Önceki
                </Button>
                <Button variant="outline-primary" size="sm">
                  Sonraki
                </Button>
              </div>
            </div>
          </Card.Footer>
        </Card>

        {/* Piyasa Eğilimleri Bölümü */}
        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Piyasa Eğilimleri</h5>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      1Y
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      3A
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      1A
                    </Button>
                    <Button variant="outline-primary" size="sm">
                      1G
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-5">
                  <FiBarChart2 size={48} className="text-muted mb-3" />
                  <h5>Piyasa Eğilimleri Grafiği</h5>
                  <p className="text-muted">
                    <Link to="/grafikler" className="text-primary">Detaylı grafikler için tıklayın</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">En Çok Yükselenler (24s)</h5>
                  <Link to="/yukselecekler" className="small text-primary">
                    Tümünü Gör
                  </Link>
                </div>
              </Card.Header>
              <Card.Body>
                {mockCryptoData
                  .filter((c) => c.price_change_percentage_24h > 0)
                  .sort(
                    (a, b) =>
                      b.price_change_percentage_24h -
                      a.price_change_percentage_24h
                  )
                  .slice(0, 5)
                  .map((crypto, index) => (
                    <div
                      key={`gainer-${crypto.id}`}
                      className="d-flex align-items-center mb-3"
                    >
                      <div className="me-3 position-relative">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          width="32"
                          height="32"
                          className="rounded-circle"
                        />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">
                          <Link to={`/coin/${crypto.id}`} className="text-decoration-none text-dark">
                            {crypto.name}
                          </Link>
                        </div>
                        <div className="text-muted small">
                          {crypto.symbol.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-success fw-bold">
                        +{crypto.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  ))}
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Piyasa Hakimiyeti</h5>
              </Card.Header>
              <Card.Body>
                {mockCryptoData
                  .sort((a, b) => b.market_cap - a.market_cap)
                  .slice(0, 5)
                  .map((crypto) => (
                    <div key={`dominance-${crypto.id}`} className="mb-3">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            width="16"
                            height="16"
                            className="me-1 rounded-circle"
                          />
                          <Link to={`/coin/${crypto.id}`} className="text-decoration-none text-dark">
                            {crypto.name}
                          </Link>
                        </span>
                        <span>
                          {(
                            (crypto.market_cap / marketStats.totalMarketCap) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <ProgressBar
                        now={
                          (crypto.market_cap / marketStats.totalMarketCap) * 100
                        }
                        variant={
                          crypto.symbol === "btc"
                            ? "primary"
                            : crypto.symbol === "eth"
                            ? "info"
                            : "success"
                        }
                        className="rounded-pill"
                        style={{ height: "6px" }}
                      />
                    </div>
                  ))}
                <div className="text-center mt-3">
                  <Link to="/piyasa-hakimiyeti" className="small text-primary">
                    Detaylı Piyasa Hakimiyeti Analizi
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Haberler ve Duyurular Bölümü */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Son Haberler ve Duyurular</h5>
                  <Link to="/haberler" className="small text-primary">
                    Tüm Haberler
                  </Link>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Card className="border-0 h-100">
                      <Card.Img variant="top" src="https://via.placeholder.com/300x150" />
                      <Card.Body>
                        <Card.Title>Bitcoin Yeni Rekor Kırdı</Card.Title>
                        <Card.Text className="text-muted small">
                          Bitcoin fiyatı son 24 saatte %5 artış göstererek yeni bir rekor kırdı...
                        </Card.Text>
                        <Link to="/haber/bitcoin-rekor" className="small text-primary">
                          Devamını Oku
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="border-0 h-100">
                      <Card.Img variant="top" src="https://via.placeholder.com/300x150" />
                      <Card.Body>
                        <Card.Title>Ethereum 2.0 Güncellemesi</Card.Title>
                        <Card.Text className="text-muted small">
                          Ethereum ağı büyük güncellemeye hazırlanıyor. ETH fiyatına etkileri...
                        </Card.Text>
                        <Link to="/haber/ethereum-guncelleme" className="small text-primary">
                          Devamını Oku
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="border-0 h-100">
                      <Card.Img variant="top" src="https://via.placeholder.com/300x150" />
                      <Card.Body>
                        <Card.Title>Yeni Kripto Projesi: Luna 2.0</Card.Title>
                        <Card.Text className="text-muted small">
                          Terra ekibi yeni projelerini duyurdu. İşte detaylar...
                        </Card.Text>
                        <Link to="/haber/luna-yeni-proje" className="small text-primary">
                          Devamını Oku
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Alt Bilgi */}
      <footer className="bg-dark text-white py-4 mt-5">
        <Container>
          <Row>
            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="d-flex align-items-center mb-3">
                <FiTrendingUp className="me-2" />
                CryptoVision
              </h5>
              <p className="text-muted small">
                En kapsamlı ve güncel kripto para piyasası takip platformu.
                Anlık fiyatlar, detaylı analizler ve profesyonel yatırım
                araçlarıyla kripto para dünyasında avantaj sağlayın.
              </p>
              <div className="d-flex">
                <Button variant="outline-light" size="sm" className="me-2">
                  <i className="bi bi-twitter"></i>
                </Button>
                <Button variant="outline-light" size="sm" className="me-2">
                  <i className="bi bi-facebook"></i>
                </Button>
                <Button variant="outline-light" size="sm" className="me-2">
                  <i className="bi bi-linkedin"></i>
                </Button>
                <Button variant="outline-light" size="sm">
                  <i className="bi bi-telegram"></i>
                </Button>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h6 className="mb-3">Ürünler</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <Link to="/piyasalar" className="text-muted">
                    Piyasalar
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/portfoy" className="text-muted">
                    Portföy Takip
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/takip-listesi" className="text-muted">
                    Takip Listesi
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/uyarilar" className="text-muted">
                    Fiyat Uyarıları
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/grafikler" className="text-muted">
                    İleri Düzey Grafikler
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="text-muted">
                    Geliştirici API
                  </Link>
                </li>
              </ul>
            </Col>
            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h6 className="mb-3">Şirket</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <Link to="/hakkimizda" className="text-muted">
                    Hakkımızda
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/ekip" className="text-muted">
                    Ekibimiz
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/kariyer" className="text-muted">
                    Kariyer
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/basin" className="text-muted">
                    Basın Materyalleri
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/iletisim" className="text-muted">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link to="/sss" className="text-muted">
                    Sık Sorulan Sorular
                  </Link>
                </li>
              </ul>
            </Col>
            <Col lg={3} md={6}>
              <h6 className="mb-3">Bültene Abone Ol</h6>
              <p className="text-muted small mb-3">
                En son kripto haberleri ve piyasa analizleri e-posta adresinize
                gelsin.
              </p>
              <Form>
                <InputGroup className="mb-3">
                  <Form.Control 
                    placeholder="E-posta adresiniz" 
                    type="email" 
                    required
                    className="bg-secondary border-secondary text-white"
                  />
                  <Button variant="primary">Abone Ol</Button>
                </InputGroup>
              </Form>
              <div className="text-muted small mt-3">
                © {new Date().getFullYear()} CryptoVision. Tüm hakları saklıdır.
              </div>
              <div className="d-flex mt-2">
                <Link to="/gizlilik" className="text-muted small me-3">
                  Gizlilik Politikası
                </Link>
                <Link to="/kullanim-kosullari" className="text-muted small">
                  Kullanım Koşulları
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Global Stiller */}
      <style jsx global>{`
        .crypto-dashboard {
          min-height: 100vh;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #0d6efd, #6610f2);
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #198754, #20c997);
        }
        .bg-gradient-warning {
          background: linear-gradient(135deg, #ffc107, #fd7e14);
        }
        .bg-gradient-info {
          background: linear-gradient(135deg, #0dcaf0, #0d6efd);
        }
        .market-card {
          transition: transform 0.2s;
        }
        .market-card:hover {
          transform: translateY(-3px);
        }
        .sparkline {
          display: block;
          margin: 0 auto;
        }
        .table th {
          white-space: nowrap;
        }
        .table td {
          vertical-align: middle;
        }
        .nav-tabs .nav-link {
          border: none;
          color: #6c757d;
          padding: 0.5rem 1rem;
        }
        .nav-tabs .nav-link.active {
          color: #0d6efd;
          border-bottom: 2px solid #0d6efd;
          background: transparent;
        }
        a {
          transition: color 0.2s;
        }
        a:hover {
          color: #0d6efd !important;
          text-decoration: none;
        }
        .card-img-top {
          height: 150px;
          object-fit: cover;
        }
        .text-primary {
          color: #0d6efd !important;
        }
        footer a:hover {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default CryptoDashboard;