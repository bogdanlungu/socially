import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import {
    Meteor
} from 'meteor/meteor';

import './partyDetails.html';
import {
    Parties
} from '../../../api/index';

class PartyDetails {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        this.partyId = $stateParams.partyId;
        this.subscribe('parties');
        this.subscribe('users');

        this.helpers({
            party() {
                return Parties.findOne({
                    _id: $stateParams.partyId
                });
            },
            users() {
                return Meteor.users.find({});
            }
        });
    }

    save() {
        Parties.update({
            _id: this.party._id
        }, {
            $set: {
                name: this.party.name,
                description: this.party.description,
                public: this.party.public
            }
        }, (error) => {
            if (error) {
                console.log('Oops, unable to update the party...');
            } else {
                console.log('Done!');
            }
        });
    }
}

const name = 'partyDetails';

// create a module
export default angular.module(name, [
        angularMeteor,
        uiRouter
    ]).component(name, {
        templateUrl: `imports/ui/components/${name}/${name}.html`,
        controllerAs: name,
        controller: PartyDetails
    })
    .config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('partyDetails', {
        url: '/parties/:partyId',
        template: '<party-details></party-details>',
        resolve: {
            currentUser($q) {
                if (Meteor.userId() === null) {
                    return $q.reject('AUTH_REQUIRED');
                } else {
                    return $q.resolve();
                }
            }
        }
    });
}
