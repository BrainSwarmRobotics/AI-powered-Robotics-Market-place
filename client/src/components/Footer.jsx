function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '2rem',
        background: '#1a1a2e',
        color: '#aaa',
        marginTop: '3rem',
      }}
    >
      <p>&copy; {new Date().getFullYear()} BSR Marketplace. All rights reserved.</p>
    </footer>
  );
}

export default Footer;