import React, { PureComponent, ReactNode } from 'react';
import { Divider, List, Text } from 'react-native-paper';
import { Release, ReleasesByTime } from '../../services/aws/api/releases/models';
import { ReleaseImage } from './cover';
import { View } from 'react-native';
import { GetTextStyles } from '../../styles/text';
import _ from 'lodash';
import { NavProps } from '../../models/navigation/navProps';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface ReleaseRowProps {
    release: Release,
    index: React.Key
    navProps: NavProps;
}

export class ReleaseRow extends PureComponent<ReleaseRowProps> {
    render() {
        var releaseDate: Date;

        if (this.props.release.releaseDate) {
            releaseDate = new Date(0);
            releaseDate.setUTCSeconds(this.props.release.releaseDate);
        }
        var stackNav = this.props.navProps.navigation;
        return <View key={this.props.release.id! + this.props.index}>
            <List.Item
                key={this.props.release.id! + this.props.index + this.props.release.releaseDate}
                title={this.props.release.name}
                onLongPress={() => {
                        ReactNativeHapticFeedback.trigger('impactLight');
                        stackNav.navigate('Details', { release: this.props.release } );
                    }
                }
                description={releaseDate!?.toDateString() ?? 'No Release Date Set'}
                left={imageProps =>  GetReleaseImage(this.props.release, imageProps.color)}
            />
        </View>;
    }
}

function GetReleaseImage(release: Release, color: string): ReactNode {
    return <ReleaseImage
    color={color}
    imageId={release.imageId}
    releaseType={release.type}
    size={100}
    source="List"
     />;
}

interface ReleasesByTimeProps {
    releasesByTime: ReleasesByTime,
    index: React.Key,
    navProps: NavProps
}

interface ReleasesProps {
    releases: Release[];
    navProps: NavProps;
}

export class ReleaseSection extends PureComponent<ReleasesByTimeProps> {
    render() {
        var headerTheme = GetTextStyles().headerText;
        return <View>
                    <Text style={{
                            marginTop: 20,
                            marginLeft: 10,
                            color: headerTheme.color,
                            fontSize: headerTheme.fontSize,
                        }}>{this.props.releasesByTime.timeTitle}</Text>
                    <GenerateReleaseRows releases={this.props.releasesByTime.data} navProps={this.props.navProps}/>
                </View>;
    }
}

class GenerateReleaseRows extends PureComponent<ReleasesProps> {
    render() {
        const rows: ReactNode[] = [];
        _.forEach(this.props.releases, (release, index) => {
            rows.push(<ReleaseRow key={release.id! + release.releaseDate} release={release} index={index} navProps={this.props.navProps}/>);
        });

        return <View>{rows}</View>;
    }
}

export function ReleaseDivider() {
    return <Divider bold={true}/>;
}
