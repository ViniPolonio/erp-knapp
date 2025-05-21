import React from 'react';
import PageWrap from '../page-wrap';
import PageContent from '../page-content';
import Content from './content';
import PageTitle from '../page-title';

const CompanyPage = () => {
  const userData = JSON.parse(sessionStorage.getItem('user')) || {};

  const companyData = userData.company || {};

  return (
    <PageWrap>
      <PageTitle>
        Editar informações da empresa
      </PageTitle>
      <PageContent>
        <Content user={userData} company={companyData} />
      </PageContent>
    </PageWrap>
  );
};

export default CompanyPage;
