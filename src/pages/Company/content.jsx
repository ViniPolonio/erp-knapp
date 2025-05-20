import React from "react";
import { Col, Row } from "reactstrap";
// import CompanyEdit from "./CompanyEdit"; // descomente se já tiver esse componente

const Content = ({ user }) => {
  return (
    <section>
      <p>Usuário: {user.name}</p>
      {/* restante do conteúdo */}
    </section>
  );
};


export default Content;
