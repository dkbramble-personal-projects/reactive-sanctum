
import _ from 'lodash';
import React, { PureComponent, useEffect, useState } from 'react';
import { StyleProp, ViewStyle, FlatList } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { Release, ReleasesByTime } from '../../services/aws/api/releases/models';
import { getReleases } from '../../services/aws/api/releases/service';
import { ReleaseSection } from './release';
import { NavProps } from '../../models/navigation/navProps';
import { useIsFocused } from '@react-navigation/native';

interface ReleaseListProps {
    navProps: NavProps,
    searchQuery: string
}

async function RefreshSensors(
    searchQuery: string,
    forceUpdate: boolean,
    setReleases: (value: React.SetStateAction<Release[]>) => void,
    setFormattedReleases: (value: React.SetStateAction<ReleasesByTime[]>) => void,
    ) {
    await getReleases(forceUpdate).then((fetchedReleases) => {
        setReleases(fetchedReleases);
        var filteredReleases: Release[] = fetchedReleases;
        if (searchQuery && searchQuery.length > 0) {
            filteredReleases = _.filter(fetchedReleases, (release) => release?.name?.toLowerCase().includes(searchQuery.toLowerCase())) as Release[];
        }

        setFormattedReleases(FormatReleaseList(filteredReleases));
    });
}

async function PullToRefresh(
    searchQuery: string,
    setReleases: (value: React.SetStateAction<Release[]>) => void,
    setFormattedReleases: (value: React.SetStateAction<ReleasesByTime[]>) => void,
    setIsRefreshing: (value: React.SetStateAction<boolean>) => void,
    ) {
        setIsRefreshing(true);
        await RefreshSensors(searchQuery, true, setReleases, setFormattedReleases );
        setIsRefreshing(false);
}

export function GetReleaseList(props: ReleaseListProps){
    const theme = useTheme();
    var isFocused = useIsFocused();


    const [releases, setReleases] = useState<Release[]>([]);
    const [formattedReleases, setFormattedReleases] = useState<ReleasesByTime[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);


    useEffect(() => {
        if (isFocused) {
            RefreshSensors(props.searchQuery, false, setReleases, setFormattedReleases );
        }
    }, [isFocused, props.searchQuery]);

    if (!releases || releases.length === 0) {
        const circleStyle: StyleProp<ViewStyle> = {
            position: 'absolute',
            alignSelf: 'center',
            bottom: '50%' };

        return <ActivityIndicator animating={true} size="large" style={ circleStyle } color={theme.colors.primary} />;
    }

    return <FormattedReleaseList
        navProps={props.navProps}
        formattedReleases={formattedReleases}
        setReleases={setReleases}
        setFormattedReleases={setFormattedReleases}
        setIsRefreshing={setIsRefreshing}
        isRefreshing={isRefreshing}
    />;
}

interface FormattedReleaseListProps {
    navProps: NavProps,
    formattedReleases: ReleasesByTime[],
    setReleases: (value: React.SetStateAction<Release[]>) => void,
    setFormattedReleases: (value: React.SetStateAction<ReleasesByTime[]>) => void,
    setIsRefreshing: (value: React.SetStateAction<boolean>) => void,
    isRefreshing: boolean
}



class FormattedReleaseList extends PureComponent<FormattedReleaseListProps> {
    render() {
        return <FlatList
                onRefresh={() => PullToRefresh('', this.props.setReleases, this.props.setFormattedReleases, this.props.setIsRefreshing )}
                refreshing={this.props.isRefreshing}
                data={this.props.formattedReleases}
                renderItem={(row) => <ReleaseSection navProps={this.props.navProps} releasesByTime={row.item} index={row.item.timeTitle + Math.random() + 500}/>}
                keyExtractor={(item, index) => item.timeTitle + index}
        />;
    }
}

function FormatReleaseList(releases:Release[]): ReleasesByTime[] {
    var releasesToFormat = releases;
    var groupedReleases: ReleasesByTime[] = [];

    var nonReleaseDates = _.remove(releasesToFormat, (release) => !release.releaseDate);

    if (nonReleaseDates.length > 0) {
        var releasesWithoutDates: ReleasesByTime = {
            data: nonReleaseDates,
            timeTitle: 'Awaiting Release Date',
        };

        groupedReleases.push(releasesWithoutDates);
    }

    var groupedByYear = _.groupBy(releasesToFormat, function(release) {

        var releaseDate = new Date(0);
        releaseDate.setUTCSeconds(release.releaseDate!);

        return releaseDate.getFullYear();
    });

    var currentYear = new Date().getFullYear();

    for (let year in groupedByYear) {
        if (year === currentYear.toString()) {
            var groupedByTrueIfWithin30Days = _.groupBy(groupedByYear[currentYear], function(release) {

                var releaseDate = new Date(0);
                releaseDate.setUTCSeconds(release.releaseDate!);

                var currentDay = new Date();
                var priorDateSeconds = new Date(new Date().setDate(currentDay.getDate() + 30)).getTime();

                return priorDateSeconds > (releaseDate.getTime());
            });


            var groupedByDay = _.groupBy(groupedByTrueIfWithin30Days.true, function(release) {
                var releaseDate = new Date(0);
                releaseDate.setUTCSeconds(release.releaseDate!);

                var currentDate = new Date();
                currentDate.setHours(0,0,0,0);
                var currentDaySeconds = currentDate.getTime();
                var milliInDay = 86400 * 1000;

                return Math.round((releaseDate.getTime() / milliInDay) - (currentDaySeconds / milliInDay)) - 1;
            });

            var releasedReleases: ReleasesByTime = {
                timeTitle: 'Released',
                data: [],
            };

            var dayReleasesByTime: ReleasesByTime[] = [];

            for (let day in groupedByDay) {
                var dayReleases = groupedByDay[day];

                var isReleased = parseInt(day, 10) <= 0;

                if (isReleased) {
                    releasedReleases.data = releasedReleases.data.concat(dayReleases);

                } else {
                    var releasesByTime: ReleasesByTime = {
                        data: dayReleases,
                        timeTitle: day + ' day(s)',
                    };

                    dayReleasesByTime.push(releasesByTime);
                }
            }

            if (releasedReleases.data.length > 0){
                groupedReleases.push(releasedReleases);
            }

            if (dayReleasesByTime.length > 0){
                dayReleasesByTime.reverse();
                groupedReleases = groupedReleases.concat(dayReleasesByTime);
            }

            _.remove(groupedByYear[currentYear], (release) => groupedByTrueIfWithin30Days.true?.includes(release));

            var groupedByMonth = _.groupBy(groupedByYear[currentYear], function(release) {
                var releaseDate = new Date(0);
                releaseDate.setUTCSeconds(release.releaseDate!);

                return releaseDate.getMonth() + 1;
            });

            var monthReleasesByTime: ReleasesByTime[] = [];

            for (let month in groupedByMonth) {
                var monthReleases = groupedByMonth[month];
                var releaseMonthEx = monthReleases[0];
                var releaseDate = new Date(0);
                releaseDate.setUTCSeconds(releaseMonthEx.releaseDate!);

                var monthString =
                    releaseDate.toLocaleString('en-US', {
                        month: 'long',
                    });

                var releasesByTime: ReleasesByTime = {
                    data: monthReleases,
                    timeTitle: monthString,
                };

                monthReleasesByTime.push(releasesByTime);
            }

            monthReleasesByTime.reverse();
            if (monthReleasesByTime.length > 0){
                groupedReleases = groupedReleases.concat(monthReleasesByTime);
            }
        } else {
            var yearReleases = groupedByYear[year];
            var releasesByTime: ReleasesByTime = {
                data: yearReleases,
                timeTitle: year,
            };

            groupedReleases.push(releasesByTime);
        }
    }
    groupedReleases.reverse();

    var sortedReleases = SortReleasesByLabel(groupedReleases);

    return sortedReleases;
}

function SortReleasesByLabel(releases: ReleasesByTime[]): ReleasesByTime[]{

    var sortedHeaders = _.sortBy(releases, (section) => {
        if (section.timeTitle === 'Released') {
            return 1;
        } else if (section.timeTitle.includes('day')) {
            return 2;
        } else if (!Number.isNaN(parseInt(section.timeTitle, 10))) {
            return 4;
        } else if (section.timeTitle === 'Awaiting Release Date') {
            return 5;
        } else {
            return 3;
        }
    });

    var sortedReleasesByTime = _.forEach(sortedHeaders, (releasesByTime) => {

        if (releasesByTime.timeTitle === 'Awaiting Release Date') {
            releasesByTime.data = _.sortBy(releasesByTime.data, (release) => release.name);
        } else {
            releasesByTime.data = _.sortBy(releasesByTime.data, [(release) => release.releaseDate, (release) => release.name]);
        }

        return releasesByTime;
    });


    return sortedReleasesByTime;
}
