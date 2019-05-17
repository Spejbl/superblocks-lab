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

import React, { Component } from 'react';
import style from './style.less';
import { BreadCrumbs, TextInput, TextAreaInput, StyledButton } from '../../../common';
import { StyledButtonType } from '../../../../models/button.model';
import { Link } from 'react-router-dom';
import { IProject, IOrganization } from '../../../../models';
import { validateProjectName } from '../../../../validations';
import { ProjectSettingsMenu } from '../projectSettingsMenu';
import OnlyIf from '../../../common/onlyIf';
import DeleteProjectModal from '../../../modals/deleteProjectModal';

interface IProps {
    location: any;
    match: any;
    project: IProject;
    organization: IOrganization;
    updateProjectDetails: (newProjectDetails: Partial<IProject>) => void;
    showDeleteProjectModal: boolean;
    toggleDeleteProjectModal: () => void;
    disconnectProjectRepository: (projectId: string) => void;
}

interface IState {
    errorName: string | null;
    newName: string;
    newDescription: string;
    canSave: boolean;
}

export default class ProjectSettingsDetails extends Component<IProps, IState> {

    state: IState = {
        errorName: null,
        newName: this.props.project.name,
        newDescription: this.props.project.description,
        canSave: true
    };

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value || ' ';
        const errorName = newName ? validateProjectName(newName) : null;

        this.setState({
            errorName,
            newName,
            canSave: !errorName
        });
    }

    onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDescription = e.target.value;

        this.setState({
            newDescription
        });
    }

    onSave = (e?: any) => {
        const { project, updateProjectDetails } = this.props;
        const { newName, newDescription, canSave } = this.state;
        e.preventDefault();

        if (canSave) {
            updateProjectDetails({id: project.id, name: newName, description: newDescription});
        }
    }

    render() {
        const { toggleDeleteProjectModal, showDeleteProjectModal, project, organization, disconnectProjectRepository } = this.props;
        const { errorName, canSave } = this.state;

        return (
            <React.Fragment>
                <BreadCrumbs>
                    <Link to={`/${this.props.match.params.organizationId}`}>{organization.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>{project.name}</Link>
                    <Link to={window.location.pathname}>Settings</Link>
                </BreadCrumbs>

                <div className={style.displayFlex}>
                    <ProjectSettingsMenu organizationId={this.props.match.params.organizationId} projectId={this.props.match.params.projectId} />

                    <div className={style.projectSettings}>
                        <h1>Details</h1>
                        <form onSubmit={(e) => this.onSave(e)}>
                            <div className={style['mb-5']}>
                                <TextInput
                                    onChangeText={this.onNameChange}
                                    error={errorName}
                                    label={'Project name'}
                                    id={'projectName'}
                                    placeholder={'project-name'}
                                    defaultValue={project.name}
                                    required={true}
                                />
                            </div>
                            <div className={style['mb-4']}>
                                <TextAreaInput
                                    onChangeText={this.onDescChange}
                                    label={'Description'}
                                    id={'description'}
                                    placeholder={'Enter a short description (optional)'}
                                    defaultValue={project.description}
                                />
                            </div>
                            <StyledButton type={StyledButtonType.Primary} text={'Save Details'} onClick={this.onSave} isDisabled={!canSave}/>
                        </form>
                        <div className={style.sectionDivider}></div>

                        <OnlyIf test={project.vcsUrl}>
                            <h1>Disconnect repository</h1>
                            <p className={style['mb-4']}>Once disconnected, all builds will be removed for given project. Please be certain.</p>
                            <StyledButton type={StyledButtonType.Danger} text={'Disconnect repository'} onClick={() => disconnectProjectRepository(project.id)} />

                            <div className={style.sectionDivider}></div>
                        </OnlyIf>

                        <h1>Delete this project</h1>
                        <p className={style['mb-4']}>Once deleted, it will be gone forever. Please be certain.</p>
                        <StyledButton type={StyledButtonType.Danger} text={'Delete Project'} onClick={() => toggleDeleteProjectModal()} />

                        <OnlyIf test={showDeleteProjectModal}>
                            <DeleteProjectModal hideModal={toggleDeleteProjectModal} project={project} organizationId={organization.id} />
                        </OnlyIf>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
