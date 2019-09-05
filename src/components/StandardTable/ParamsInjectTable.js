import React from 'react';
import StandardTable from './index';
import {handleRefresh} from "@/utils/utils";

class ParamsInjectTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
    };
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const {onChange, formValues} = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    } else {

      const getValue = obj =>
        Object.keys(obj)
          .map(key => obj[key])
          .join(',');

      const newFilters = Object.keys(filters).reduce((obj, key) => {
        const newObj = {...obj};
        newObj[key] = getValue(filters[key]);
        return newObj;
      }, {});

      const params = {
        ...formValues,
        ...newFilters,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      };
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }

      handleRefresh(this, params);
    }
  };

  handleSelectRows = rows => {

    const {onSelectRow} = this.props;

    this.setState({
      selectedRows: rows,
    });

    if (onSelectRow) {
      onSelectRow(rows);
    }
  };

  render() {
    const {...rest} = this.props;
    const {selectedRows} = this.state;
    return (
      <div>
        <StandardTable
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default ParamsInjectTable;
