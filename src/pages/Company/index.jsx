import React from 'react';
import PageWrap from '../page-wrap';
import PageContent from '../page-content';
import Content from './content';
import PageTitle from '../page-title';

const CompanyPage = () => {
  const userData = JSON.parse(sessionStorage.getItem('user') || '{}');

  return (
    <PageWrap>
      <PageTitle>
        Editar informações
      </PageTitle>

      <PageContent>
        <Content user={userData} />
      </PageContent>
    </PageWrap>
  );
};

export default CompanyPage;
