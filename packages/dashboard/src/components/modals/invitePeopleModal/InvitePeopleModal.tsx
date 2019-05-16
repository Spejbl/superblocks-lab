// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import style from './style.less';
import classNames from 'classnames';
import { TextInput, StyledButton, Modal, ModalHeader } from '../../common';
import { IOrganization, StyledButtonType } from '../../../models';

interface IProps {
    hideModal: () => void;
    addMemberToOrganization: (organizationId: string, email: string) => void;
    selectedOrganization: IOrganization;
}

interface IState {
    email: string;
}

export default class InvitePeopleModal extends React.Component<IProps, IState> {

    handleEmailChange = (e: any) => {
        this.setState({
            email: e.target.value
        });
    }

    onConfirmClick = () => {
        const { email } = this.state;
        const organization = this.props.selectedOrganization;

        this.props.addMemberToOrganization(organization.id, email);
    }

    render() {
        const { hideModal } = this.props;

        return (
            <Modal hideModal={hideModal}>
                <div className={classNames([style.invitePeopleModal, 'modal'])}>
                    <ModalHeader
                        title='Invite new members'
                        onCloseClick={hideModal}
                    />
                    <div className={style.content}>
                        <p>
                            Invite new members to your organization
                        </p>
                        <TextInput
                            id='email'
                            type='text'
                            label={'Email address'}
                            required={true}
                            onChangeText={this.handleEmailChange}
                        />
                        <div className={style.footer}>
                            <div className={style.cancelBtn} onClick={hideModal}>Cancel</div>
                            <StyledButton type={StyledButtonType.Primary} text={'Invite member'} onClick={this.onConfirmClick} />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
