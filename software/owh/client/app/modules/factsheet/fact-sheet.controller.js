(function(){
    angular
        .module('owh.fact-sheet')
        .controller('FactSheetController', FactSheetController);

    FactSheetController.$inject = ['$scope', '$state', 'factSheetService', '$filter', 'SearchService', '$rootScope', '$stateParams', '$q', '$window', 'utilService'];

    function FactSheetController($scope, $state, factSheetService, $filter, SearchService, $rootScope, $stateParams, $q, $window, utilService) {
        var fsc = this;
        fsc.notParticipateStates = {
            PRAMS: {
                states: ['AZ', 'CT', 'DC', 'ID', 'IN', 'IA', 'KS', 'KY', 'NV', 'NH', 'VA'],
                message: "This state did not take part in PRAMS"
            },
            YRBS: {
                states: ['DC', 'MN', 'OR', 'WA'],
                message: 'This state did not take part in YRBS'
            },
            CancerIncidence: {
                states: ['KS'],
                message: "The state did not meet the United States Cancer Statistics (USCS) publication standard or did not allow permission for their data to be used."
            }
        };
        fsc.queryID = $stateParams.queryID;
        fsc.fsTypes = {
            state_health: "State Health",
            womens_health: "Women's and Girls' Health",
            women_of_reproductive_age_health: "Women Of Reproductive Age Health",
            minority_health: 'Minority Health'
        };
        fsc.states = {
            "AL": "Alabama",
            "AK": "Alaska",
            "AZ": "Arizona",
            "AR": "Arkansas",
            "CA": "California",
            "CO": "Colorado",
            "CT": "Connecticut",
            "DE": "Delaware",
            "DC": "District of Columbia",
            "FL": "Florida",
            "GA": "Georgia",
            "HI": "Hawaii",
            "ID": "Idaho",
            "IL": "Illinois",
            "IN": "Indiana",
            "IA": "Iowa",
            "KS": "Kansas",
            "KY": "Kentucky",
            "LA": "Louisiana",
            "ME": "Maine",
            "MD": "Maryland",
            "MA": "Massachusetts",
            "MI": "Michigan",
            "MN": "Minnesota",
            "MS": "Mississippi",
            "MO": "Missouri",
            "MT": "Montana",
            "NE": "Nebraska",
            "NV": "Nevada",
            "NH": "New Hampshire",
            "NJ": "New Jersey",
            "NM": "New Mexico",
            "NY": "New York",
            "NC": "North Carolina",
            "ND": "North Dakota",
            "OH": "Ohio",
            "OK": "Oklahoma",
            "OR": "Oregon",
            "PA": "Pennsylvania",
            "RI": "Rhode Island",
            "SC": "South Carolina",
            "SD": "South Dakota",
            "TN": "Tennessee",
            "TX": "Texas",
            "UT": "Utah",
            "VT": "Vermont",
            "VA": "Virginia",
            "WA": "Washington",
            "WV": "West Virginia",
            "WI": "Wisconsin",
            "WY": "Wyoming"
        };
        fsc.state = $stateParams.state;
        fsc.fsType = $stateParams.fsType;
        fsc.fsTypeForTable = $stateParams.fsType;
        //To populate select box
        fsc.stateJSON = [
            {id:"AL", text:"Alabama"},
            {id:"AK", text: "Alaska"},
            {id:"AZ", text: "Arizona"},
            {id:"AR", text:"Arkansas"},
            {id:"CA", text:"California"},
            {id:"CO", text:"Colorado"},
            {id:"CT", text:"Connecticut"},
            {id:"DE", text:"Delaware"},
            {id:"DC", text:"District of Columbia"},
            {id:"FL", text:"Florida"},
            {id:"GA", text:"Georgia"},
            {id:"HI", text:"Hawaii"},
            {id:"ID", text:"Idaho"},
            {id:"IL", text:"Illinois"},
            {id:"IN", text:"Indiana"},
            {id:"IA", text:"Iowa"},
            {id:"KS", text:"Kansas"},
            {id:"KY", text:"Kentucky"},
            {id:"LA", text:"Louisiana"},
            {id:"ME", text:"Maine"},
            {id:"MD", text:"Maryland"},
            {id:"MA", text:"Massachusetts"},
            {id:"MI", text:"Michigan"},
            {id:"MN", text:"Minnesota"},
            {id:"MS", text:"Mississippi"},
            {id:"MO", text:"Missouri"},
            {id:"MT", text:"Montana"},
            {id:"NE", text:"Nebraska"},
            {id:"NV", text:"Nevada"},
            {id:"NH", text:"New Hampshire"},
            {id:"NJ", text:"New Jersey"},
            {id:"NM", text:"New Mexico"},
            {id:"NY", text:"New York"},
            {id:"NC", text:"North Carolina"},
            {id:"ND", text:"North Dakota"},
            {id:"OH", text:"Ohio"},
            {id:"OK", text:"Oklahoma"},
            {id:"OR", text:"Oregon"},
            {id:"PA", text:"Pennsylvania"},
            {id:"RI", text:"Rhode Island"},
            {id:"SC", text:"South Carolina"},
            {id:"SD", text:"South Dakota"},
            {id:"TN", text:"Tennessee"},
            {id:"TX", text:"Texas"},
            {id:"UT", text:"Utah"},
            {id:"VT", text: "Vermont" },
            {id:"VA", text: "Virginia" },
            {id:"WA", text:"Washington"},
            {id:"WV", text:"West Virginia"},
            {id:"WI", text:"Wisconsin"},
            {id:"WY", text:"Wyoming"}
        ];
        fsc.minorityFactSheet = {tableHeaders: {
                population: ['Racial distributions of residents', 'Total', 'American Indian or Alaska Native',
                    'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'White'],
                detailedMortality: ['Cause of Death', 'State/National', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'White'],
                infantMortality: ['Indicator', 'State/National', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'White'],
                brfss: ['Question', 'State/National', 'American Indian or Alaskan Native, non-Hispanic', 'Asian, non-Hispanic', 'Black, non-Hispanic',
                    'Native Hawaiian or other Pacific Islander, non-Hispanic', 'Multiracial non-Hispanic', 'Other, non-Hispanic', 'Hispanic'],
                natality: ['', 'State/National', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'White'],
                tuberculosis: ['', 'Rates', 'American Indian or Alaska Native', 'Asian', 'Black or African American',
                    'Native Hawaiian or Other Pacific Islander', 'Multiple races', 'Hispanic or Latino', 'White'],
                std: ['Disease', 'State/National', 'Rates', 'American Indian or Alaska Native', 'Asian', 'Black or African American',
                    'Native Hawaiian or Other Pacific Islander', 'Multiple races', 'Hispanic or Latino', 'White'],
                hiv: ['Indicator', 'State/National', 'Rates', 'American Indian or Alaska Native', 'Asian', 'Black or African American',
                    'Native Hawaiian or Other Pacific Islander', 'Multiple races', 'Hispanic or Latino', 'White'],
                cancer: ['Cancer Type', 'State/National', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black', 'Hispanic', 'White']
            }};
        fsc.imageDataURLs = {
            bridgeRace: "data:image/png;base64,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",
            detailMortality: "data:image/png;base64,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",
            infantMortality: "data:image/png;base64,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",
            natality: "data:image/png;base64,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",
            brfs: "data:image/png;base64,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",
            yrbs: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAABJ0AAASdAHeZh94AAAVdElEQVR4nO3dd3xUVdoH8N85d2bSew+EFFKZTEgIxVBDBGmCCAZIFhBFWXV1P2tZ9V1BR4i4qPuubeVFd0V3XZa2il1QSaiKKC0JJRSREgIpkELKzNzzvH8gKkqQJNM53z8zyXmeO58n995T7rmAJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJElSpyiOTsCZFaYVxeojh5cZwoa3lVUXb3d0Pq6EOzoBZzUtY/4Q0mA3gO7E2CxH5+NqNI5OwNnk569U+P79dzPizxORAgAELHV0Xq5GnrF+QKxAXzRec6CijBF7KSYulA8YnHTxw3WOzMwVMUcn4GjTUozR0PEbAX4biK4LCPZRh+alKfFJ4fj7i5+rzc2mbctL5w5ydJ6u5poorHy90VchrieF92AQWkYsCkTRjPE8AcoEAP9AH3XAkJ6KITMWjDGseGMLThyrBUDPEVfeFD5eh1d98UCLgw/FZbhtYRWmLUhSNXSHwni+EBT/888Z4xQZ7U+JqVE8MTkSwWF+YN9/GyeP1eE/Szf/ok3OWalKWC2E5dVV5cYqmx+EC3O7wpqQssjPW2d6moHdxTljPeLDWLeYIObj74kzlQ0w9ImBr78XvLy0YOzyhy8E4UhFFVSV0NjQgob6Znh6aPHd0VqqPFYHcLSSioVVYZY/l5QYLXY+RJfgVoVVmFYUCw37iHGk9hvYk/cbmAgPT61VYzQ2tmJryQGU7vgOjPFPPRTzlDd2Gc9ZNYgbcJvCys9aGKZVaYe3ty7y5sIBmoioAJvGO3LwDN5f/bWqWtTtZ5v9cz8+9Ps2mwZ0MW4x3GCEkWtU8bZWp0RNu32QzYsKABKSwjGpcIBChAEBHg0v2jygi3GLwtpv4NNI0OAxE7OUwCAfu8WNiQ3BkOtTGRjNKTTMz7ZbYBfgBoVFTGFKUfcewaJncqTdo2cPSICPn6dK4E/aPbgTc/nCmpqxMEsVIj6jbxxvp5NnU4pGgSGzh0KgUbMyjYH2z8A5uXxhQYgxABDfM9xhKcQnhgMETYtFyXNYEk7G5QuLEeuh89SqXt46h+UQFOLzfS6IdVgSTsblCwucIn28PRyagpe3DowBxMn+N3lOyvWXzRApTHHscNyFEXxGILlw8iLXP2NJTkkWlmQTrn8pvIwD+07h/ZXbEd09GIWzB1utXSEISxcX42xNE2bePRzh4X5Wa9vduOUZ65svDgEAKk/U4V+vboCqUpfbbG424dUXPsPZmiYAwK7tR7rcpjtzy8KqrmpA955hGP2bfjh9qh6v/OUT7N19vFNtCQF8uekgXnv+U5xvbMGUe3PhE+CFbytOWzlr9+J2l8KTx2phNqu4blQaJt89FAn6aLz17Kf4aM1ObFy/D4OGpUCfGQPOr/w/ZTar2PnVEXy15TC1tphYaFQAbp87BllDE3Hm5DlsXLMbra0WeHq63VdoFW73rXz95WEAQN+8FADAkPEG9B+ZinXLvsY7r23G2vd349OPShEQ4I3wqAAEBnkjINgHwiJwru486uvP43TlOTQ1mSBUgcAQHzb9jyOQe3MmFM2FYuw7PBkl7+zCzm2HkTMsxWHH6sxcv7AIgc3nTT+cfo5/W4uQSH/0SI744Vc8PLUYf3sORv2mH/Z+dRQ7NhzENyUHcaD85C+aYwwI7x6EITf1RtbQJKT0iYFGe+nwVHpOPLQ6BfvLTv5QWETEGFiCrQ7T1bhsYeVn/zlAY7b8gwQNam1uw/pPytBnQDzaWi0YPjIVl5uQ1nlokDkkEZlDEnH73DGwmFU01J3H2eomcIUjKNQXfsHeUJQrXyY9PLXoPTgRO0sqIARhzfJt339CN0/TFy1RYblvVbnRZP2jdh0uOVI8I+NZH5D5E4WzkaN+0481nmvGoX2nsL+sEmazBQV/yENYt19faMAVDi9fDwSH+yEozBeePjpwfnWj+GaTBds/v7BE+XRVA2KSwtF/RCq+3VeZzTjXh6YNe/vo0RLR1WN1VS7ZKzSL1scYsZw/vjyVz3z4Bjy94g4kpkej+fyF1cEpfWJsnkOfoRceZm1qakPWsCQ8tXw2Zs8bgzlP3ggITIqsVm6zeRJOzOXOWPl6Y7CiKCuHT8rUjp0xAACg1WmQM6oXdm46hEHj0pE5ONHmeXh4aXF03ymEdQvCg8/nQ6u78FXGpUWiYvcJUXOqvm/q0Lte2Lt3VdcH0VyQy91jacH6CUFeg280XPJzL18PLPrvHLvm8tBLUy/786ETMnjp1iPRvOJQTwAVdk3KSbjcpVAwJQUAImOCHJ1Ku8K/v79jFjXVwak4jMsVFiNhAYDmJud92qq5sRUAQJybHZyKw7hcYQnOqwGg9lS9o1NpV833uTGiagen4jAuV1gg2gEA1ZVOXFiV9WCMqaqfd7mjc3EUlyusFWVzjyga/t2OkoNO2dsiArYXV6iMYcu1vDuNyxUWwMhiEX/dsekQaqsaHJ3MLxzcfQKVR2oUIvqro3NxJBcsLEDTqi5VOFrWvLbF0alcQgjCO0s2k6Lw45bUlPcdnY8judwAKQCU1pW06UPz+JG9lXnevh5I6t3d0SmBCPjnonXY8mEZI8J9K0vu3uXonBzJJQsLANJy79rCa2oMe7YeSTt9/Cy4whEc4feLlQi21lTfgl2bDmP58+tp0/uljAEvLC+b94xdk3BCLr2NUX7+SkXZd2Ae4+xhEuQ1fHIW5hjH2TWHhXcuo9IvjzCu8HpSxbz/lM19GWBO2bGwJ5curIsmpCzy89Katnh6avVLNj7APbysu9lae2oq6/H70S9BEFsr/LxvvpZ7gT/nkjfvP/fegUcaGRf3t7Wa+bZ1++wWd9P7pSACFJXuk0V1KbcoLABI3UPFnPPj61Z8LcgOFyLVIvD56p0qY9i0bN+8g7aP6FrcprCMMAqV1GcOl1by0i9s/2jWxvf2oLaqXhGEa/5G/XLcprAAoKEl8DWu8MpVf9tg07OWxaxi9eKNKuPs6xVlcz+0XSTX5VaF9fGh37eRRX3i0J6T/ItPbDdN9+E/t6GuqkFhqjpX9gAvz+UW+v0aS6/UpdoDB2//R9HH/fX945SAEOvuSVr5bS1Wv1wiAKxeVv7EWqs2/jOFBmOCCo2BQ5zz00VsffWb37rMMhy3OmMBwKpVU1SYxa0tjW2WVx//gEhY74RiNql45bF3hRA4y0zq76zW8M+MSXzRoyB9weuClMOMaA0RK2k01xwt1Bf1t1VMa3PZkfcrKa0prksPG3761LG6Ca0tZmQM7PrjfiQIrzz2LvZsOQJBNHX5vidsNmWT3S3nOYDdPWh0L0y9ZxiSDNE4uOekt8WsTk4Pv/7NsjPrz9sqtrW4ZWEBQFl18Y70sDyvg7tPDPby0SE5s/PziSQIb/3lM6xfvRMg3LeifN6/rZjqJfL1C3tx4J/9hiWz6fdfj6BQX3SLD0VK7+5889q9XgD5lp0pdvoOg9sWFgDcUj1sfW0477Fn65GspnMtMAxMuOrnBi8ytVnwt0fWUPE7uxgYFS0ve3yRjdIFAGRE5b6uVZSku4zjmJfPj/uqBoT44OyZRnbySE12WmTeir2ni2ttmUdXuXVhlaCEys6sfy89YqN6uLRy+Fef7ROeXloWm/rrW4USAWuXbccrf3pXVOw+SSDctbzs8edsme+0jPlDINjTI27pwzIvc/nukRiGDR+WERPoXnZm/Qpb5tJVbjFXeDUKDAsmEuEdAAgK98Powr4YOzMHGu2l/ZfWFjP+u3gjSt7ehab6C7M0grFhK0vnbrRthsQKM5760tNb13f+0pm8vV2g333zS6xb+Q0ANmh52dytts2p866ZwgKAaekLCAA0Og0sJgsYZ9DqNPDx84AQhJamVpjNAiQInj4eaD3fBgIdW1H2uM232S7QF00mRqtvmTMYw2/q3e7vtTSbMO+2N0Xbecu2ZaV/GuSs42hufSm8FLGMiE2P3FDYT/M/iwsQnRAK/yAfcM5gMQvSeWoRHRfK+uQmYfysHNxpHIej+6pQfeJcVenp9S/bMrM52Uu0JmpeExLmFzjjgRHsSpuSaLUKtDoNK//muxhDxMZdZWeK99syt85yuwHS9kxPWxhpIfLsFh8CL18PDJ2QgaETMi5+fNkzd7f4EOzecjjeCCM3wmizDT4aW0/fSYz1nHBrDrRXsVBxyLh0rH93tzhX3fRMbq7xA2d8GafbDZC2x6JRRwFAfK+oq/6bhPRokCDd/nRlqK3ympCyyA+cz+/eM4yyh17dnhMajYKbbs3hQlBSVK0y21a5dcU1UVhzspdoOVf+JzGjm+hp6HbVfzdgZBqCI/xVztk8gGxyP+qtNT1IRCGTZw9krANDIdlDEtEjMUyAoShfb/S1RW5dcQ0UFrFGU/VrQhXJU+4d1qE3hCkajvx7hylCUN40w4L51s4sX2+MZJw93Cu7B5I7+EAI4ww3zx7ISSBUYcqD1s6tq9z65r3QYExIj9j8BhGmzvjjSPx8h5qrEZsSiebGVhzaUznUEJ4Xawgf8aW1plQyIkY8y0A5d/5pDPyDvDv89yER/vju4BnUVDUMMIRd/3dnmupxy8IqSH8qwxCe9xKBLQGQMvPhGzB25oBOtcUYkDEwARaziv07j2cB9JAhIi8qIyTvQGlNcV1nc8zPWJCiEF7vPyKVDRmj72wz6BYfio0flmmcbarHbS6FYxJf9CjQFxVMy1iwmSB2Eyj/4md+QV5da5wxePr8+IYxAn4rFFRMMxStm2oouik319jh3rWG2NNcw9mN09tfsKCqAs/cvwp7rrAiNjo2GDkjUhkDfpufscBptnB2+TNWYVpRrD4y92FPrXkZQDO0IX7dgif341EPjUFAXi80btyPbR/vxeljdYhLjYCPf8eK7Oi+Kix+7F2s/+9OaEN9kbDkdgSMzQDXKjAdPxtHbeZC31Zltj5suFdG+IiKq7kcFRjm5xDhuRGTMlnWoPZ7guY2C1Yu3ojo2BAkpke3+3s9EsOw8YMyghNN9bjkyLsRRl6hZyMF5/cQsfEMxLz7xFHQ2N7Mp28c8JPelWg14eQT76DtQBXAgOGTsjBorB7JWTHt7o5sbrOg/Kuj2PDuHny5di+YwuDbPxFRj4y75BxPZhWNWw/i3Ae7qfXAKQYGCyOsBrG//af8sS2XHxUnVmB4arOnl/a6+Utncm/f9t+12NZixgO3vIrxMwZg9LS+V/xOnG2qx6UKa2bqwhCTRtwGjnsgKJ5760TADQYeMMYAXdSVd0luO1qNqr+uhfm7WghB8PLRITW7BwLD/BAY6gOhEuprmlBT1YADO47DbLKAKxwe+m6I+sMoaEKv3KNvO1KNcx/vQUPxPkEmCwdn5RDi5Wazx7/fO/BI48Xfm2oouokRrZl0x2Bcf3P7UzdAxwrrx6ke81fLSh8b6OipHpcorEJ9UX/B6R4GFBBB55kUIQLH9uZ+Q5LBdB27vRHNJtSv24PGDRWwVDcCZpXIbGHgDEyjEGkVpusehIDcNPhfrwc0HbsNFc0mNBTvxbkPdwvTibOccXaeVCxVwRdXh5kqouo05YEhPolPvDad/9ooe0cKCwBK3tuDVUs2AWCTlpfNfadDiVuZ0xbW+Gyjt7dJmcoYuxeC+jCtIvyHpvCAsRnwTHKBN+QS0Fx2AvUf7UbjF4cJQjAwVgGi5FsfGoH+w3/9PrujhWWxqHhyzjJx9kzDt3668DRHrpF3urnCwrQFScTpLjLz2SAK0EX4i4BxveGf14srfp6OTu/qMcDb0B3ehu4Iq21i5z4uxdm3tydHxwSj37Bkm4TUaBRMnJXDX1+0tmdD2+nZAP7PJoGuJhdHBf6p3FyjJqpWuZHA7hFEI8E4+faNZwHjesOndw+ODq76dDaaEF9wrQKyCEyaPQgdmbrpqD6De+Kzt8PpxOHqBfl641uryo1NNgt2BQ4trNxcoyayRnMP6vAnIopQ/L3UwNHp8B+VzrRh/o5MzarUhhacfXs7UrNikJpl27dmMM4wafZA9vyjay5O9Txp04DtcNgA6YwMY3hUreZzgF7wSowIi3poDBLemK2ETB8IdyoqAKhdvg2i1YyJt+XYJV6SoRv0/WLBOHskX290yA2pQ85YBYaFqWZG6zlHRMTvRsI/rxd33m5E15hOnUP9R3vQLzcFMT3D7BZ34m0DUf71MU+FaZ4AcLfdAn/P7mesfL0xmBh9pHh7hHdfNIX7X9/LifumXVf7r63gnOHGmfZ91vTHqR6a44ipHrsXFmfKQhDFRT06TnGJYYMuaD1YhcbNFcgdb0BIuP0v7zdO7w+NRoGG8Gd7x7ZrYRUYFqYy4M6A0QbmbXD8hrQ2RUDNG5vh6eOBUVOzO9WE1kOD3jkJSEjr3D9gYKgv8iZnciJMnKKfP6hTjXSSXQuLhDoLjLGQKS6zBUGnnd/xLZpLT2D0lGz4dHL8jXOGOXPHdHgR4E+NvKUPvP08hEbhz9lqFezl2LGwiIGzyV6p0dCEON1KWusShNqlmxEY6ovcHx/YcAgvbx3GFfbnQtB109KfmmivuHYrrPysp0NBlOjTJ9aNb9UvqC/eh9ZjtZgwY8APL8h0pMFj9QiO8BeM0bNzspfYZedfuxWWzmKJBABthJ+9QjoEmSyoe+sLRMWFoF9e1zpjFouKHZsPo+Z0117totEouPm2HE6EnvVtZ+7oUmNXyW5nj4L0J0cS+DoA8EyOcsqnd63BcvY8LNUN7HdPjkevvj261NaWT/Zi2UvFiIoNxtxXCrrUFhHwzP2r6Pih6rrzJm38T5fy2IL9BkhJaQGjDQDQWnHKbmHti2kZx4DkjG5KWnbXigoAouOC4e3rgZ4deBay3cwYLk71hHhrTQ8CMHa50SvFs2Xj15pphgX/C8L9j76Qj5jEcKu0KQR1eOulK1n85Ico//q7FotqSVhVbqyyWsM/4zYPUzjatExjHAO7t29uktWKCoBViwoAJs7KAREuTvXYjCwsKyGL8igAzfgZnXvMzF6ivp/qAeiu6WlPdf0a2w5ZWFbCORuemhWD0MgAR6fyq3JuSAMAWLiw2Wi8LCxrEcJibjO7RG/XbFIBAIzDZrvUyMKyEsHwwaHyU3zbZ/thj3f5dNb5hlasWbpFMKCVQbPBVnFkr9BKZsUZPVv9NG+DaExgqK8aFhXg+CH3n2g814yq42cBAIwzkxA0fkXZvHW2iicLy4pmxRk9W3019xIwgnMEOTqfnyJBEQBiAZQQ0cMryh/f7uicJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmyo/8HO2OKRfpB8vYAAAAASUVORK5CYII=",
            prams: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAABJ0AAASdAHeZh94AAAeKklEQVR4nO3dd1xUR7sH8N/MWdiFRUA6SBUEZEHArrEgauwx6kvEkqZ54+u9ajTJTdMka415c6OJpprkNcVuosZo7KKxREWjSJEmTYpU6Sy7e87cP0i8FkCWXQTzme+f7J6Zs7sPpzzzzByA4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4zjO9BiZ4ae2Bhhpj97H+K2Tj/FbJ2+PvjuSdvny28L07su7SWZYTQkZIYnMmgq0gknsMIH+jS3x6oy27DsqaocgJCfPppS+ykTmCwBEINeZxD7UBwZ8vXPnU2Jb9t8R/S0Ca2rIihkE7Fu53IwOGhNEnd3tUHCjDGcOJEparV4C2LPb4t/Z0hZ9R4WvcjQT2W5Jkh7zDe7Cwvr7EAC48nsGu56YTyjoGRA6YUv8m7faov+O6pEPrGjV8kUgWOPp78Tmvj2OWNtZ3n6trKgK36w+zLJSbhKArQpMkN5WQy2Zqu9pQctUVCb8Sijc/zFnMB00Jhjkz2+UMeDMoURs++QkA0GynmDkzrgleabqu6MT2nsHWo+RaJVsNQiWq3p54r+XTiCWne6+tLFQytFveACpKK1BbkbJ4FJnGtrdcej+pOITWmN7nx6yfCwR6GHLTgq7eSsnCqEDut4OKgAgBPD0c4KHnyOJO33dHoxFhziN+DWh6FiJsX0/Ch7JI1ZEhFrmWiJsYMDzfYcFYOaiSAgCbfL9jAExe+Lw0zdnGCEsXRSlOTsS341pTd9RvVbbCFrduwBZ2MXHjs19Zzzt7GjV7DYZ127is3d+kTQabSURyagtiUsutKbvR8kjF1gTeqktlTphOySMHz4pFJNmPQZCW/Yxrv1xA5vWxYjlxVUCoeQXBumDbVffPg0Q9qBto1RqO0plLwqEvCpJkv3Ax7sjas4QmCtkLeq7ILsM6xf/LFVW1NUTUZy0JfHdQy3a8BH1SAXW9JD3OoNI+yVJGvDkrIEYOSXc4Da09Xoc3XUZx366ImnqtJRQkghR+kUEO8zAriEoqHjnzqfEKJXaSkbN3ZkkDgbF4xRkvMSYwi+4C5s8ayDxCnAyuO+y4iqsX7xXKs6vYBLw7Pb4JZsNbuQR8cgEVlToii4yhiNgCJy5cBjpP6K7Ue3V1+lw7ug1nDuewm6kFRHWzDFLaSWXQvp3pRFPhMDD19Gofqsr6vCZej/LTi0khJFFWxOXfGRUgx3UIxFY00JWBYJIR2WUus5ePJqG9PU2afs1VRqkxeehtLAKu74+AwAYOr4H3Lzt4OXvBHcfhxafbltCq9Hj61UHkHgpB4Sx1VsT336rJafjR0mHD6zpqhV9mcAOKRTm1v+1bALt2t2lvXfJJERRwqa1x3EhJgUA+c9NB/2cEyfU+vbeL1Pp0OmG6aqlo5hAD1rbWCoXvj+JevoZdxrqSCglCO3vg3qNFpnJN8OtNLSnj/vQn1MLTujae99MocMGVnTIsukgwo+OXaxli/49mTq52bb3LpkcIQTde3rCXGGG5D9u+CskWWSI88hd8UXHNO29b8bqkIE1NXj5SwTkKy9/Z/LSyonUxk7Z3rt0H1FkuJFehNS4PNRU1QMgMJPLms2nNcU3yBUOztaIO5fpDsImdneJ3JNUeLzK9Hv98HSwayxGpqmWr2KEvKHq5YkX3hrT4jxRW9PpRBzbfQXnjlzDreJq6HWNjysrlHL0HuyHJ57tD6W1wqA+4i9k4ZuVByW9JBWA0RFb499KNsW+t4cOE1gREWqZS4nsS4DNakk2/WE6uP0SDmyNhV4nggDoZK+EnZMVXDztYOdsg5qKOlSW1aK8rBo5KYUQ9RJACLp42+Gfb46GY5eWn8b/Lln6DhFYUQPWWMhqarcziU0wNJveliS9hA9f34Ws5EJQgSJiUiiiX4pEJ1uLJrfR6yUc2hyLg1suoCS/AoQQTJjZD6Oie7W434KcW1i/ZK9YeatG+6hm6dv9Gmt6yHudqVZ7kDE24slZAzF+Zj8Q0v5BxRiwct425F4vgbNnZ6zd918YMCoIcoVZs9tRSuAf5o6xT/eDXCFDwvkspMTlory0Gj36+bSo7042Fug5yI8mxGYKNdW66cHOEekJRTHxpvhcD0u7BlZ0gNqNCOQEgPCnF0WSoeND2nN37rLpo2NIvnwDPt1d8P6uf0Fu0XxANSYg3AN9RwbizP4EZFy7iU42lvDyb9lQkIXSHH2G+pPUq3mkorRmisopsjyxKOa8wTvRTtrtIiaqx/IAKjc7Lwg0cM47Y40eojGlovxynDuWDEtrCyzd9DyoEd+Sh58TVu14AVRGsXPDb9DUtjxNpbRWYOF7TxJVL08Q4KNpqmXvtVfJtaHa5Yg1VbWsj4wKJ+QKmeO8lRNpYJh7e+xGkz59dx8qSmqwaM0UdOnqYHR7VjYW0Ov0uHYxB9UVtejRv2WnRAAQZBQ9h3RDaWEV8rJKBwU7nfJwCBrya1bWCZMVLLaFh37Emhq8/HEq0JOdbC2sX/nfKR1uiEar0SMntRAObrYIH9LNZO1OmTsUMjMBl06lG7ytIFA8s2g4RkwOA8BmuZQJuyf0Uls+cMN29FCTRNNUK6Yxwr53dLWm81dOpHaOnR5m9y1yfE8cGAMi/xFm0nZlMgq3rg64kVKImup6KK0Mm8hDKMGk2Y+BgeLYrj/GK7XCtejglUspobsbq6ePCl/lKNPpR0mEuhNIZaIkHd+ZqDY8qlvpoZ0Ko4NXLABhX3sHOGNBB82mA8De78+jvLgKL6+NgpnctP93BZmlSLuaBweXTvDsZlg9V12tFt9/eBRnDyX+9ScbgE0ExYJgp2HUx2PoxdSCE7qoXqttetgNXUqBnWCIIsAIgEyghM4Pdor06O474UhS7qE2H+x+CEcsRqKDl68A2FuqXl7shbdG046STW9MUe4tmCnMcG/9vCn4h7njwKYLKMwtN2g7vVbE+iU/IyetGKrJ4Qid2gdKZ2vkXczG1a0XLHIvZS+z0pm9OT1sZQ7T6r0ZgdxrQFf0mNoXLj26oDKvHFc2nScpB+JnC9W1nhER6rFtXUnRpr9wQzZ9xRcAmf1nNp10lGx6UzR1WljZGnb5UpRXjsVTv4FviBumvRQJr0DnRt9nY9dQG19XU29Q+8f3XEF2ShEi3hqDgDH/n5Lx6OcDj34+KEzKR/apdIua4qoAKxdr+A4LhN0dBYm2nnaIeGsM7Hwd8fsnx0e6FtPnAHxt0E4YqM1+5agBayxcS4WfAMwePikUz7w8vMMM0TRHr5cgtzA3aBtbBytETgnHjbRiqJ/9DnU1jU8CUlg25MJ09S2fv6rXijj+81U4q9zgP7rxPJ9zkBv6zhmCYUvGoc8Lg+8KqjsF/6MnbDzsRFD6RlTUjja9DGqTX/q5MLWtWVXdEcbwxJOzBmLyC4M6xBBNSxAQ6OoNO0uYy2WYtigSC9dMgaZWi6QLWY2+LzulEABg72bTonYZA3ZvPIuq8lr0mzsUxg5IUIGi35whAmPMlyanLm7LnJjJT4XRAWq3ekl2GIQFPb0wEh0p8dkSlBLU17Zu2mHOn4Hj6m3f6OuZ124CALy6Nn5EYQzISStCTnoRSgsrce1yLnKvF6P37EFwDfVo1T7dy3uIP4Kn9ETCT38sndZj1VgmLT8OwrKYhPPbE9+JM0knMHFgTQ1d5U8ldlSgpMvsxaOJqWvTHwaFpTnq6gwLrPzMUuz89CTOH7mG3sP84epl1+j7Es5nAgC6hXW5v42sUmz6OAbZqQ3BKZgJcPB3wuj3JsNrkJ+Bn6JphAADXxoB5+AuuLzpXO9bGSV9GWsYnp3WY8VvelE/2xRpCZMFVnTwit6ESYflFmY2j3JtemdHK1RfL8atwip0dm5Znu3knjjEnbmOsTP7ImpeRKOnfb1OREFWGWztlLBU3n3HWZBdhjWv7YbIGB57aQTcwj3Q2cQTOO5ECOA3ojv8RnQXJL2Esoxi5MZm4eI3pwfJIDsTHabut+2KOsuYPkxyATcteOlISukha1tL5cLVk4RHuTa9qqIOqVfzYK6QQdXCagRVP2+Me6Yfwod0g8ys8a9015enkRSbjZ5Dut1X5fD16kOoqKjFxM9nwusxX1jYKR9ahQehBJb2VnDp4Y4uvb1I2sFEC6Zn3glFMduNadfoi/epqmXRjNBfHVytFa+umSI0dRro6CQJOPnLVVw8kQoAOPbjlRZvSylpNpkqScC+786BUoop/xx012slhZVIj89D0MRw2PkYPy5pDGdVF3QbHUwZoU9OD3mvszFtGXUqjA5aFg5Ctnj6OeG/l44nVjZNF8CZSnFeOdKTCmDd2RI+gS6wvGdoRBIZYmNSkByXi+rKOig7yRHU0wuhA30gV9yfRpAk4PCOizi84xLq/7wblMkF1FTWIT+rFG5NXIgbYu83Z1Bfq0XYY75Q3FN+U5BZCgDwHR5odD8ZMSkQ5DJ4DfRtdRt+wwOR/EscYUQXCOD31rbT6sCKitoh0JS0ryxtFNL8FU8I9/7ApqbTidjy0XFc+POIAjSUlcx5eyx8g1xReasWW9bFIOlSDkTx7oH/2Jg00I8IBo8Jxj/mDLldBnMz9xY+fmMPKm/VggoUA0arMH3RMFCZgNcnb8DKFzbj2dcfR69I/1bn4BgD9v7nLAglmDFv2P1v+POUp9cYP+vr8ubzkFvJjQosfZ1pZp+1OrBoUnKUREivp14cfN9Roy1sXnscsSdTMe6ZfoiM6ony4mpsXHUQ6978GcMmheLYriuQRAlyS3MMGOaPoL7e8A50Rk2lBpdOpOL4T5dxcl88SgurMFc9Dr/tT8COL34DkxjCBvliwQeTYXHH53jzy+n4+JWfsPblH2HvYo2BY1ToHRmAbj26GHRRfWZ/Auqq6xHY0wOW1vd/T24+DZcOpWmFcA6+/27xYSv+8660RitPMKad1p8KCR1OCAyqLWqtlLgbDUH1bH/MfHUEAMDN2x6Lv5qJucPW4sjOPyAzo5j5P6MwZkaf+7YP7u+Dma+OxLzH1yEhNgtfLt+P+HNZoDIBc1dNwGPjgu/bpqvKFf+7dy5++OAIjmy7iF82/o5fNv6OgWNUmP/vSS3e911fngIARM8d0ujrdo7WMJfLUHWzssVttqWq/HJQgebvTXjdqOlnRly8MwdbO6VkZt72BRK/H0qGlY0Fpvxr8F1/P7O/oQzcztka6w7PbzSo/iLIKJZveh4AcPVcFgQZxYrNzzUaVHXV9di+LgYLx3yCI9suglACG3slrGwsEDHZsHKaohu3YN3ZEo5NTLjV1NZDW6+H0tHaoHbbitLBCmDM9sVeXxpei32HVh+xCEFmeVkNqavVwsLSsLE1Q93IKMaQiT3uOlUlns/C5jXH0DOiG175+CnQFpyeHNxsoFCaQ1OjxbJNz8E7yPW+95z5NQGbPjiK8pJq9BjYFVMXDEPvSH9YdjJsjiAA1FRqIIoSHFwbH8JhDNi/JRaEEni0MLXR1jwf88XlzectK7TF8wGsaW07rT5iEYnsYoyR47tNNgrQKMYa1pVS9fG+6+86nYiwQb6Yt3pSi4IKAGqr66HT6DF2Zl/4qNzue11Tq8Vnb/6Mzk6doP7+Wbz55XQMmdijVUEF3DE26HR/opUxYNc3pxGzJw7BU3rCxsOou3uTcQlxR9dhgYww9mF08IoFrW2n1YG1NXHJaULIkcM7L0mG1hcZQpIkaDV6+ATdnckPG+SL1z6NhoWy5UfLpNhsiKKEnhH+jb6usDTH+sPzsWLrLASEGz82V1JQAQCwsb+/qPHQ9os4vjsO/mOCMWBepNF9mdLwt8eRLn18GMA+nqpaFt2aNoxKkOopnpf0Us33a45KktQ2yzsJAkW3kC6wbWEZc3P7Iekb0hDNTX23c7Zu8RHwQYrzGv7hbO3vXqO0sqwW+7fEwqOfD4a+PrrDVX5QMwGjVk4kdr6OIhWET1pzvWVUYO2MW5InQVqQlVJIj+1qeabaEKIoobigAucOJT3wvfu/P495I9c1+XrXYFcQQnBg88OZtR535joAILiP111/v3w2HZIooc+sQaAdtEbNzMIcYTP6CUyS7Mu1RUMN3d7oT7Ut/u3vCMGv+344JxXkmH6NfEGg6OygxE+f/9awJkIzzv6agOZWMHZwtYGDqw1O7Y3H+cPXWrU/JfkVOLQ1FmsW7kROalGz781ILIDcwhyO99RfFRdUglACe//GK007CseAhssPATA442qCfxfC9JS8KIms5pvVByWNiTK3dxozrQ/yM0uwceVB6LT3V18yieFSTCoyEgvQKyKg2bZcfR0gV5rjo1d+wvJZP+DCkWRUl9c1+X5NrRYpl29gx/oTeG3yBswftR7frjqEzKSbzRYExp26DlEvwbrz/WXOllZyMImhpqRjr1RU+ec1IpNQaui2Jimb2Rm3JC86eOW0gpxbv/xn9SE2552xJq1tV/X2wqTZg7D7m9OIP5eJ8MF+sHW0Ql11ParKaxF3JgNlhQ0JxqC+Xk22o9eJyEoqQOgAHwT398HOT3/D2pd/BCGAm48DrO2UUForIOpFVJfX4VZJNUryG75cQgn8Q90RvTASPYd2g7uvY7MVnV+q94EAmP36yPte6x7ugf2bLiDjWApCZ/Q16rtpK4wB149dAyFEhFZ/wtDtTVaPtS1h8f5pqhUvJ17MXrvr6zOImjP4wRsZYPikUPgFuWLflvM4+fMVaGp1IJTAwtIcPgHOKCusBCFo9m7uUkwqKktrEDE5HGGDfDF0YihSr+Qi8UIWMpMKUFOpQX5mCczkMlhZW8A/1B0Rk8Lg4euIoD5esGpmlZk7/frDBdwqqoKvyg0efvdP8/IOcEFAqAfObzgJO18HePTv2urv5U5EICCCaW4E4rfHIvVAAgD26bZUtcFP0zDx7Qgj0cErPwPYv6bOHYIhbbTIhyQxaOv1kCvMbh81XnryC1haK/DliUVNbpd7vQQndl/B9JeHm+zO7155GSV4bfIGgAErf3gO1k0EY0VpDT5+aw9Kiqox+v0pcO/d9JG2pYqTb4LKKOwbCWZDJOz6A2fWHgUBjlbLxYm/XFLXGtqGiW9JCLOWOy4ghBzd8cUpFt/EpAJjUUqgsDC761QkihIsH5DTcvd1wMxXR7RZUGlqdXhnxkYwUcK0+RFNBhXQkNta9O/JcHG3xYmV+yEaOIGjMY6BLkYHVfXNSpz9+DgDsKtcYzO+NUEFtMEsnQ2X5ujkgj4KBIkblh9gl357aLO6YfQ0FiPodCLejPoKtdX1GDAqCAMff/Akkk42FpgxfxhqSqqRffb6Q9jLB0s5EA8wpjXXCy8eSF9g2ATIO7RJEuXbK+pyvagfCrDYjf8+hDMHH5yDMpZASZPz+dpaWVEV5g3/GDdzytA1yAUzFjRSd9UETz9HUIHiVlbHeChYWWYJiEDTv09+y+A7wTu1WXZuZ6K6TIA8EiBHt6yPwZEfL7dVVwAApY0C1eWtOmobJT0+DwvHforKW7XoOdgXr3wwxaDtqys1DXVk1sZX32rKa6GtNm4lb7m1BRhj7sbOOWzTtO8PV/+nprzOejwhZPeejWex99vf0dwza4zh4m4HUS8hM7GgbTpoxP7vz+Hdmd9BV6/H2Ol9MfuN0Qa3cSO9GABg62VcCXR1YSU2TfkcmyZ/AY0R/2B2Pg5gomQTHbzSqEXL2nw84UD6gvoCe/1TBNh4aOcf2PbpiftKh01hxKSGOqktHx03edv3Ks6rwGuTN2DTB0cBAsx67XGMa6YWrDnVVQ3JWRt34x6QoK/XQ9SK0NfroG8kidxSNu63qyyMGhZ4KMu+NKxswmZPDV5RdvpA4iv52WXshTdGkcZG/VsrqI8XLCzNkRSbjfLiatg+4OGUraGt1+PzxT/j/OFkMMbg4tkZ81dMhK0Rn8O6c8O2xUkF6OTSsqn3jbH1tEPUt8+DmgmwaqRMp6WKkvIBAALV32x1I3ioS0UuRWJRzGGV47DMitKaseeOpRCvbo7U3sV0lZMyMwFJl3Jw+WQaRkb3MdlNorZej80fHsXaRT8iJ7UICkszTJ8fienzh0FhZJGjjZ0SJ/bFoyK3HAHjQoyaT2hhp4TCiJlSujotjq/YL4n1+oQtV995v9UNoR3WIE0sjokLcRq+V68TR587lmIr6kXSNcjVJCvR+HR3QWJsNnIzSnDldBoingwzKmd143oxPnl9D75auh9pcXkAIRg2sQcWrJoED1/TzAEUBApzcwGxBxNRklYIzwG+EMwf/vph1YWV2L9oh1iZV04ZwzOJRTFG5T/aLfET1Wu1jUyr/5wxNs3Fw1Z6euEI6t3EulKGkESG9+ZvR352KSyUcsxaPBqDJrR8BCD5Ug4ObLqApNhsVFc0XP9YWskxcJQK457uA3Mz0//ojAH7Np3Hoe0XAUJg19URjt1d4RToDP9RwRBMvLIgANRXaZCyPx4laUUoTrmJ8uxSgJB6BjZ3e/zbG41tv90rzKJVy5+gAvlKYnAcMSmUjJvRz+jn50gS8OOG33ByXwLAGOQW5nDzsUNgL0+ED+4GmTmFXitBq9EhM+km0q7mIj+jBOWlNbefkSMIFG4+9hg9tTfCBppmLO9BblwvxukDichJL0ZhXjnqa7VQOnTC2DVRJp0lnXs+E4ff2SvqausFgZKbEkMGY9JZSqTPt8SrM0zRR7sHFtCwnpZGL/sQYLM6dbYUx8/sKwwY2d3o02NVhQY7vjiJpNhsPKich1ACZSc5PLs5Y+i4YAT19jZqfffWYAyI+/06dm88K5XkV1JC6O+EwsNMKXedtuUFQW6CmeZlGcXYNfs7iUk4rxN1z7TVgrcdIrD+Mk21YhAR8KEksb5OXWykSc8PpCH9u5rkIry0sLLh+iuzBJIIEMIAQuDkZose/Xzg7NG+z0PMuHYTu74+wzKTbxJKyHWRsde2JyzZPbXHKhWRpPjwp/uj74uNz000xOEle5B1Kq2aMMGzsdWWTaVDBVYDRqJVK6YQgXzAJObt2c2JDX8yjIQP9n0klpo0BGNAypUbOL47jiVeyiaU0FKRSW/byJ2+3nBpzu1DbLRq2R5qbvbEtC0vEKsm7qJrS2tQdK0AcitzOAa5QdbIDUDBlRzsnb8NYHh/W+Lbb7TdJ+uQgdUgSqU2FyD8U6D0NZFJnjZ2SjFiQojw2GiVwc8B7Gj0WhGxJ1NxbNdlqSDnFqWElEmMravVma/Zm3L/DOSpqmWhVKCx9t2cZRGvjyb2dyzlXZxUgNj/nGY3zmfe/i0t7JViz6cHCIETetwOsNzYLJx8/6BUU1JdKmO64B+uqpuvqzZShw2sv0RF7RCEa6lPEMIWMYbBZjJBCh/sR3sO8UNguAfMmliPqqNhDMhKuYlLp9Jx4XiqWFNZJ1BCkiTG1iiqxc3fZqmbHeSbGrJiIiXYCsYsnILdmY2bDanMr2Q3428QEFLPGH4gYJsJg4IJ5F1IrL+FrYXkFu5JK3JvSSVpRZQItJiJbOy2hCUX2/rzdvjAutP0kGW9JInOowKiJIkpFQozKWyQH+012A8B4e4d7lTJGJCTWoRLp9Jw6dR1sbykSiCE6AB2QATW74hfcgwgLR49jQ5Te0MUFgBkAAGCGMF1MLZbIYjrv72ivj25Uw01TVHJpjLKogklvpBQKgHHaL3+s62tqAZtjUcqsP7ynLdaUd9JGM2ApwghTzKJWcgVMqmryo36BbnCV+UK7wAXPIx1Je7EJIb87DKkJ+YhPT4faQkFYlV5rUAIEUFwlDFpm0KQ9twZBH9Xj2Rg3WlCL7WlUiOMZYSMkgkkQhQlPwCgAmVe3Zzg5e9EnNxs4OBmC0cXG9g5W0EmMy7gGAOqbtWiqKAcxfkVKC6oQH5mKdLi8yVNnZY29E+KJJHFEMaOmomy3cbWNz1qHvnAutfTPdROWkkYBMIGU0KHAlAxif3/gB4BOjt0Eh1crAULpTnkcjPILcwgt5BBrjCHucIMMhlFvUYHrUYHTZ0e9Rod6jVa1Gt0qCitkYryyqHTirfPuwxggkAzmSidZIT9xhg5tT1hSYYhp7m/m79dYN1LDTVNDpZ1IYx1Y5T5gaEbA/GjAvEhIJ0AKBljSkjMkjVSRkQoqSMENQCpZkyqYhIKQJBGJJLOCEkTqZQOUczcmahun/LVDupvH1gtx8hz3kvlksJcWSdozQBUqxJRq4a6Qz9wkuM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juM4juO4h+7/AJQfY19939jSAAAAAElFTkSuQmCC",
            tb: "data:image/png;base64,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",
            std: "data:image/png;base64,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",
            hiv: "data:image/png;base64,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",
            cancer: "data:image/png;base64,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"
        };

        fsc.getFactSheet = getFactSheet;
        fsc.exportMinorityFactSheet = exportMinorityFactSheet;
        fsc.exportWomenFactSheet = exportWomenFactSheet;
        fsc.exportWomensOfReproductiveAgeFactSheet = exportWomensOfReproductiveAgeFactSheet;
        fsc.exportFactSheet = exportFactSheet;
        fsc.getStateName = getStateName;
        fsc.getMeanDisplayValue = getMeanDisplayValue;
        fsc.findByKey = findByKey;
        fsc.calculateRate = calculateRate;
        fsc.isNumeric = isNumeric;
        fsc.getCancerCountDisplayVal = getCancerCountDisplayVal;
        fsc.isValueInvalidDisplay = isValueInvalidDisplay;

        if(fsc.queryID) {
            getQueryResults(fsc.state, fsc.fsType, fsc.queryID).then(function (response) {
                if (!response || !response.resultData) {
                    if (!fsc.cacheQuery) {
                        // redirect to default query if we were tryint to retrieve a cached query
                        // and was not found in the cache
                        $window.alert('Query ' + fsc.queryID + ' could not be found');
                        $state.go('factsheets', {
                            queryID: ''
                        });
                    }
                }
            });
        }

        /**
         * To get query results usig queryID. If no results found with this queryID
         * then server get the results and save results using this queryID and returns results
         * @param state
         * @param fsType
         * @param queryID
         */
        function getQueryResults(state, fsType, queryID) {
            var deffered = $q.defer();
            factSheetService.prepareFactSheetForState(state, fsType, queryID).then(function (res) {
                if(res && res.resultData){
                    var womensHealthCallback = function (resFsType, resState) {
                        SearchService.generateHashCode({fsType: resFsType, sex: 'male', state: resState}).then(function (hashcodeResponse) {
                            factSheetService.prepareWomenFactSheetMenData(state, resFsType, hashcodeResponse.data).then(function (mensResponse) {
                                if(mensResponse && mensResponse.resultData) {
                                    $rootScope.mensFactSheet = mensResponse.resultData;
                                }
                                prepareWomensHealthPopulationTable();
                            });
                        });
                    };
                    fsc.state = res.resultData.state;
                    fsc.fsType = res.resultData.fsType;
                    fsc.fsTypeForTable = res.resultData.fsType;
                    fsc.stateName = fsc.states[res.resultData.state];
                    fsc.factSheetTitle = fsc.stateName+" - "+fsc.fsTypeForTable;
                    fsc.stateImg = 'state_' + res.resultData.state + '.svg';
                    fsc.stateImgUrl = '../../images/state-shapes/state_' + res.resultData.state + '.svg';
                    fsc.factSheet = res.resultData;
                    if($rootScope.nationalFactSheet == undefined || ($rootScope.previousFSType == undefined || $rootScope.previousFSType != fsType)) {
                        SearchService.generateHashCode({fsType: res.resultData.fsType}).then(function (hashcodeResponse) {
                            factSheetService.prepareFactSheetForNation(fsType, hashcodeResponse.data).then(function (response) {
                                if (response && response.resultData) {
                                    $rootScope.nationalFactSheet = response.resultData;
                                    $rootScope.previousFSType = fsType;
                                }
                                if(fsc.fsType == fsc.fsTypes.state_health) {
                                    prepareStateHealthPopulationTable();
                                } else if(fsc.fsType == fsc.fsTypes.womens_health) {
                                    womensHealthCallback(res.resultData.fsType, res.resultData.state);
                                } else if(fsc.fsType == fsc.fsTypes.women_of_reproductive_age_health) {
                                    prepareWomensOfReproductiveAgeHealthPopulationTable();
                                } else
                                    prepareMinorityHealthPopulationTable();
                                deffered.resolve(res);
                            });
                        });
                    } else if(fsc.fsType == fsc.fsTypes.womens_health) {
                        womensHealthCallback(res.resultData.fsType, res.resultData.state);
                    } else if(fsc.fsType == fsc.fsTypes.women_of_reproductive_age_health) {
                        prepareWomensOfReproductiveAgeHealthPopulationTable();
                    } else if(fsc.fsType == fsc.fsTypes.state_health) prepareStateHealthPopulationTable();
                    else prepareMinorityHealthPopulationTable();
                }
            });
            return deffered.promise;
        }

        /**
         * To export factsheet data into PDF
         */
        function exportFactSheet() {
            //We can pass multiple images to 'SVGtoPNG' method to generate dataURL
            var imageNamesForPDF = ["../client/app/images/state-shapes/"+fsc.stateImg];
            SearchService.SVGtoPNG(imageNamesForPDF).then(function(response){
                var allTablesData = prepareStateHelthTablesData();

                var hivTableData = prepareTableBody(allTablesData.hiv.bodyData);
                var hivTableDataHeaders = prepareNestedTableHeaders(allTablesData.hiv.headerData);
                hivTableData.unshift(hivTableDataHeaders[1]);
                hivTableData.unshift(hivTableDataHeaders[0]);

                var stdTableData = prepareTableBody(allTablesData.std.bodyData);
                var stdTableDataHeaders = prepareNestedTableHeaders(allTablesData.std.headerData);
                stdTableData.unshift(stdTableDataHeaders[1]);
                stdTableData.unshift(stdTableDataHeaders[0]);

                var cancerTableData = prepareTableBody(allTablesData.cancer.bodyData);
                var cancerTableDataHeaders = prepareNestedTableHeaders(allTablesData.cancer.headerData);
                cancerTableData.unshift(cancerTableDataHeaders[1]);
                cancerTableData.unshift(cancerTableDataHeaders[0]);

                var detailMortalityTableData = prepareTableBody(allTablesData.detailMortality.bodyData);
                var detailMortalityHeaders = prepareNestedTableHeaders(allTablesData.detailMortality.headerData);
                detailMortalityTableData.unshift(detailMortalityHeaders[1]);
                detailMortalityTableData.unshift(detailMortalityHeaders[0]);

                allTablesData.bridgeRaceTable2.bodyData = prepareTableBody(allTablesData.bridgeRaceTable2.bodyData);
                allTablesData.bridgeRaceTable2.bodyData.unshift(prepareTableHeaders(allTablesData.bridgeRaceTable2.headerData));

                allTablesData.infantMortality.bodyData = prepareTableBody(allTablesData.infantMortality.bodyData);
                allTablesData.infantMortality.bodyData.unshift(prepareTableHeaders(allTablesData.infantMortality.headerData));

                allTablesData.tb.bodyData = prepareTableBody(allTablesData.tb.bodyData);
                allTablesData.tb.bodyData.unshift(prepareTableHeaders(allTablesData.tb.headerData));

                allTablesData.brfss.bodyData = prepareTableBody(allTablesData.brfss.bodyData);
                allTablesData.brfss.bodyData.unshift(prepareTableHeaders(allTablesData.bridgeRaceTable2.headerData));

                allTablesData.pramsTable.bodyData = prepareTableBody(allTablesData.pramsTable.bodyData);
                allTablesData.pramsTable.bodyData.unshift(prepareTableHeaders(allTablesData.pramsTable.headerData));

                allTablesData.yrbs.bodyData = prepareTableBody(allTablesData.yrbs.bodyData);
                allTablesData.yrbs.bodyData.unshift(prepareTableHeaders(allTablesData.yrbs.headerData));

                allTablesData.natality.bodyData = prepareTableBody(allTablesData.natality.bodyData);
                allTablesData.natality.bodyData.unshift(prepareTableHeaders(allTablesData.natality.headerData));

                var bridgeRaceTotalText = "";
                if(fsc.fsType === fsc.fsTypes.womens_health) {
                    bridgeRaceTotalText = "Total state female population: "+$filter('number')(fsc.factSheet.gender[0].bridge_race);
                }
                else {
                    bridgeRaceTotalText = "Total state population: "+$filter('number')(fsc.factSheet.totalGenderPop);
                }
                var lightHorizontalLines = {
                    hLineWidth: function (i, node) {
                        return .5;
                    },
                    vLineWidth: function (i, node) {
                        return .5;
                    },
                    hLineColor: 'gray',
                    vLineColor: 'gray'
                };
                var pdfDefinition = {
                    styles: {
                        "dataset-image": {
                            alignment: 'left',
                            margin: [0, 0, 55, -35]
                        },
                        "state-image": {
                            alignment: 'left',
                            margin: [0, 0, 55, -35]
                        },
                        "state-heading": {
                            fontSize: 16,
                            alignment: 'left',
                            margin: [50, 0, 0, 0]
                        },
                        "footer": {
                            fontSize: 5,
                            italics: true
                        },
                        "footerLink": {
                            fontSize: 5,
                            color: '#6f399a',
                            italics: true
                        },
                        heading: {
                            fontSize: 10,
                            bold: true,
                            decoration: 'underline',
                            margin: [50, 5, 0, 10]
                        },
                        underline: {
                            decoration: 'underline'
                        },
                        "tableHeader": {
                            bold: true
                        },
                        table: {
                            margin: [0, 2, 0, 2]
                        },
                        'info': {
                            fontSize: 6,
                            italics: true,
                            margin: [0, 1, 0, 0]
                        }
                    },
                    defaultStyle: {
                        fontSize: 8
                    }
                };
                //Prepare source for PRAMS, YRBS and Cancer based on selected state
                var PRAMSSource = $filter('translate')('fs.state.prams.footnote');
                var YRBSSource = $filter('translate')('fs.state.yrbs.footnote');
                var CancerSource = 'Sources: 2016, CDC NPCR Cancer Statistics, † Female only, †† Male only';
                if(fsc.notParticipateStates['PRAMS'].states.indexOf(fsc.state) > -1) {
                    PRAMSSource = 'This state did not take part in PRAMS';
                }
                if(fsc.notParticipateStates['YRBS'].states.indexOf(fsc.state) > -1) {
                    YRBSSource = 'This state did not take part in YRBS';
                }
                if(fsc.notParticipateStates['CancerIncidence'].states.indexOf(fsc.state) > -1) {
                    CancerSource = 'Sources: 2016, CDC NPCR Cancer Statistics, † Female only, †† Male only. The state did not meet the United States Cancer Statistics (USCS) publication standard or did not allow permission for their data to be used.';
                }
                pdfDefinition.footer = function(page, pages) {
                    return {
                        columns: [
                            { text: [
                                    {text: 'This factsheet is last updated on '
                                        + $filter('translate')('app.revision.date')+' and downloaded from',
                                        style: 'footer'},
                                    {text: ' Health Information Gateway', link: 'http://gateway.womenshealth.gov/',  style: 'footerLink'}
                                ]
                            },
                            {
                                alignment: 'right',
                                text: [
                                    { text: page.toString(), italics: true, style: 'footer' },
                                    { text: ' of ', italics: true, style: 'footer'},
                                    { text: pages.toString(), italics: true, style: 'footer' }
                                ]
                            }
                        ],
                        margin: [10, 0]
                    };
                };
                //Todo: Confirm the column alignment
                    pdfDefinition.content = [
                        {image: response.data[0], width: 50, height: 50, style: 'state-image'},
                        {text: fsc.factSheetTitle, style: 'state-heading'},
                        {image: fsc.imageDataURLs.bridgeRace, width: 50, height: 50, style: 'dataset-image'},
                        {text: "Population in "+fsc.stateName, style: 'heading'},
                        {text: bridgeRaceTotalText},
                        {
                            style: 'table',
                            table: {
                                headerRows: 1,
                                widths: $.map( allTablesData.bridgeRaceTable1.headerData, function (d, i) {
                                    return '*';
                                } ),
                                body: [
                                    prepareTableHeaders(allTablesData.bridgeRaceTable1.headerData),
                                    prepareTableBody(allTablesData.bridgeRaceTable1.bodyData)
                                ]
                            },
                            layout: lightHorizontalLines
                        },
                        {
                            style: 'table',
                            table: {
                                headerRows: 1,
                                widths: $.map( allTablesData.bridgeRaceTable2.headerData, function (d, i) {
                                    return '*';
                                } ),
                                body: allTablesData.bridgeRaceTable2.bodyData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: $filter('translate')('fs.state.health.bridgerace.footnote1'), style: 'info'},
                        {text: $filter('translate')('fs.state.health.bridgerace.footnote2'), style: 'info'},
                        {image: fsc.imageDataURLs.detailMortality, width: 50, height: 50, style: 'dataset-image'},
                        {text: 'Mortality',  style: 'heading'},
                        {
                            style: 'table',
                            table: {
                                headerRows: 2,
                                widths: $.map( detailMortalityTableData[0], function (d, i) {
                                    return i==0 ? 200 : '*';
                                } ),
                                body: detailMortalityTableData

                            },
                            layout: lightHorizontalLines
                        },
                        {text: $filter('translate')('fs.state.health.mortality.footnote1'), style: 'info'},
                        {text: $filter('translate')('fs.state.health.mortality.footnote2'), style: 'info'},
                        {text: $filter('translate')('fs.state.health.mortality.footnote3'), style: 'info'},
                        {image: fsc.imageDataURLs.infantMortality, width: 50, height: 50, style: 'dataset-image'},
                        {text: 'Infant Mortality: (All Causes, Not gender-specific)', style: 'heading'},
                        {
                            style: 'table',
                            table: {
                                headerRows: 1,
                                widths: $.map( allTablesData.infantMortality.headerData, function (d, i) {
                                    return '*';
                                } ),
                                body: allTablesData.infantMortality.bodyData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: $filter('translate')('fs.state.infant.mortality.footnote'), style: 'info'},
                        {image: fsc.imageDataURLs.prams, width: 50, height: 50, style: 'dataset-image', pageBreak: 'before'},
                        {text: 'Prenatal Care and Pregnancy Risk', style: 'heading'},
                        {
                            style: 'table',
                            table: {
                                headerRows: 1,
                                widths: $.map( allTablesData.pramsTable.headerData, function (d, i) {
                                    return '*';
                                } ),
                                body: allTablesData.pramsTable.bodyData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: PRAMSSource, style: 'info'},
                        {image: fsc.imageDataURLs.brfs, width: 50, height: 50, style: 'dataset-image'},
                        {text: 'Behavioral Risk Factors', style: 'heading'},
                        {
                            style: 'table',
                            table: {
                                headerRows: 1,
                                widths: $.map( allTablesData.brfss.headerData, function (d, i) {
                                    return '*';
                                } ),
                                body: allTablesData.brfss.bodyData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: $filter('translate')('fs.state.brfss.footnote'), style: 'info'},
                        {image: fsc.imageDataURLs.yrbs, width: 50, height: 50, style: 'dataset-image'},
                        {text: 'Teen Health', style: 'heading'},
                        {
                            style: 'table',
                            table: {
                                widths: $.map( allTablesData.yrbs.headerData, function (d, i) {
                                    return '*';
                                } ),
                                body: allTablesData.yrbs.bodyData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: YRBSSource, style: 'info'},
                        {image: fsc.imageDataURLs.natality, width: 50, height: 50, style: 'dataset-image', pageBreak: 'before'},
                        {text: 'Births', style: 'heading'},
                        {
                            style: 'table',
                            table: {
                                widths: $.map( allTablesData.natality.headerData, function (d, i) {
                                    return '*';
                                } ),
                                body: allTablesData.natality.bodyData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: $filter('translate')('fs.state.birth.footnote'), style: 'info'},
                        {image: fsc.imageDataURLs.tb, width: 50, height: 50, style: 'dataset-image'},
                        {text: 'Tuberculosis', style: 'heading'},
                        {text: 'Population: '+$filter('number')(fsc.factSheet.tuberculosis[0].pop)},
                        {
                            style: 'table',
                            table: {
                                widths: $.map( allTablesData.tb.headerData, function (d, i) {
                                    return '*';
                                } ),
                                body: allTablesData.tb.bodyData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: $filter('translate')('fs.state.tuberculosis.footnote'), style: 'info'},
                        {image: fsc.imageDataURLs.std, width: 50, height: 50, style: 'dataset-image'},
                        {text: 'Sexually Transmitted Infections', style: 'heading'},
                        {text: 'Population: '+$filter('number')(fsc.factSheet.stdData[0].data[0].pop)},
                        {
                            style: 'table',
                            table: {
                                widths: $.map( stdTableData[0], function (d, i) {
                                    return i==0 ? 200 : '*';
                                } ),
                                body: stdTableData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: $filter('translate')('fs.state.std.footnote'), style: 'info'},
                        {image: fsc.imageDataURLs.hiv, width: 50, height: 50, style: 'dataset-image', pageBreak: 'before'},
                        {text: 'HIV/AIDS', style: 'heading'},
                        {text: 'Population: '+$filter('number')(fsc.factSheet.hivAIDSData[0].data[0].pop)},
                        {
                            style: 'table',
                            table: {
                                widths: $.map( hivTableData[0], function (d, i) {
                                    return i==0 ? 200 : '*';
                                } ),
                                body: hivTableData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: $filter('translate')('fs.state.aids.footnote'), style: 'info'},
                        {image: fsc.imageDataURLs.cancer, width: 50, height: 50, style: 'dataset-image'},
                        {text: 'Cancer Statistics', style: 'heading'},
                        {
                            style: 'table',
                            table: {
                                widths: $.map( cancerTableData[0], function (d, i) {
                                    return '*';
                                } ),
                                body: cancerTableData
                            },
                            layout: lightHorizontalLines
                        },
                        {text: CancerSource, style: 'info'}

                    ];
                var document = pdfMake.createPdf(pdfDefinition);
                document.download(fsc.stateName+"-"+fsc.fsTypeForTable+"-factsheet.pdf");
                return document.docDefinition;
            });
        }


        /**
         * To get fact sheet data from server
         * @param state
         * @param fsType
         */
        function getFactSheet(state, fsType) {
            if(state && fsType) {
                SearchService.generateHashCode({state:state, fsType:fsType}).then(function (response) {
                    $state.go('factsheets', {
                        queryID: response.data,
                        state: state,
                        fsType: fsType,
                        cacheQuery: true
                    });
                });
            }
        }

        /**
         * To prepare table headers for pdfmake content using given headers array
         * @param headers
         * @param cssClass
         * @return table header array
         */
        function prepareTableHeaders(headers, cssClass){
            var tableHeaders = [];
            angular.forEach(headers, function(eachHeaderText){
                tableHeaders.push({text: eachHeaderText, style: cssClass ? cssClass : 'tableHeader', border: [true, true, true, true], fillColor: '#EFFAFE'})
            });
            return tableHeaders;
        }

        /**
         * To prepare table headers for pdfmake content using given headers array
         * @param headers
         * @param cssClass
         * @return table header array
         */
        function prepareNestedTableHeaders(headers, cssClass){
            var tableHeaders = [];

            //first row
            angular.forEach(headers, function(eachHeader){
                if(eachHeader.nestedHeaders) {
                    tableHeaders.push({text: eachHeader.header, colSpan: eachHeader.nestedHeaders.length,
                        style: cssClass ? cssClass : 'tableHeader', border: [true, true, true, true], fillColor: '#EFFAFE'});
                    for(var i=0;i<eachHeader.nestedHeaders.length-1;i++) {
                        tableHeaders.push({});
                    }
                }else {
                    tableHeaders.push({text: eachHeader.header, style: cssClass ? cssClass : 'tableHeader',
                        border: [true, true, true, true], fillColor: '#EFFAFE', rowSpan: 2})
                }
            });

            var nestedHeaders = [];
            //second row
            angular.forEach(headers, function(eachHeader){
                if(eachHeader.nestedHeaders) {
                    angular.forEach(eachHeader.nestedHeaders, function(eachNestedHeader){
                        nestedHeaders.push({text: eachNestedHeader, style: cssClass ? cssClass : 'tableHeader',
                            border: [true, true, true, true], fillColor: '#EFFAFE'})
                    })
                }else {
                    nestedHeaders.push({text: {}, style: cssClass ? cssClass : 'tableHeader',
                        border: [true, true, true, true], fillColor: '#EFFAFE'})
                }
            });

            return [tableHeaders, nestedHeaders];
        }

        /**
         * To prepare table body for pdfmake content using given table data array
         * @param data
         * @param cssClass
         * @return returns table body data array
         */
        function prepareTableBody(data, cssClass){
            var tableBody = [];
            angular.forEach(data, function(eachRecord){
                if(angular.isArray(eachRecord)) {
                    var eachRow = [];
                    angular.forEach(eachRecord, function(value){
                        eachRow.push({text: value, style: cssClass ? cssClass : 'table', border: [true, true, true, true]})
                    });
                    tableBody.push(eachRow);
                }
                else {
                    tableBody.push({
                        text: eachRecord,
                        style: cssClass ? cssClass : 'table',
                        border: [true, true, true, true]
                    })
                }
            });
            return tableBody;
        }

        function prepareMinorityNatalityData() {

            var natalityHeaderData = ['', "State/National"];
            angular.forEach(fsc.factSheet.natality.birthRateData, function(eachHeader) {
                if(eachHeader.name != 'Unknown') {
                    natalityHeaderData.push(eachHeader.name);
                }
            });


            var natalityData = [];
            //---BirthRates--
            var stateRow = [{text:'Birth rates', rowSpan: 2}, 'State'];
            var nationalRow = ["", "National"];
            angular.forEach(fsc.factSheet.natality.birthRateData, function(data, index){
                if(data.name !== 'Unknown') {
                    stateRow.push(fsc.calculateRate(data.natality, data.pop));
                    nationalRow.push(fsc.calculateRate($rootScope.nationalFactSheet.natality.birthRateData[index].natality,
                        $rootScope.nationalFactSheet.natality.birthRateData[index].pop));
                }
            });
            if (fsc.factSheet.natality.birthRateData.length === 0) {
                for(var i=1; i < natalityHeaderData.length - 1; i++) {
                    stateRow.push('Not available');
                    nationalRow.push('Not available');
                }
            }
            natalityData.push(stateRow);
            natalityData.push(nationalRow);


            //---BirthRates--
            stateRow = [{text:'Fertility rates', rowSpan: 2}, 'State'];
            nationalRow = ["", "National"];
            angular.forEach(fsc.factSheet.natality.fertilityRatesData, function(data, index){
                if(data.name !== 'Unknown') {
                    stateRow.push(fsc.calculateRate(data.natality, data.pop));
                    nationalRow.push(fsc.calculateRate($rootScope.nationalFactSheet.natality.fertilityRatesData[index].natality,
                        $rootScope.nationalFactSheet.natality.fertilityRatesData[index].pop));
                }
            });
            if (fsc.factSheet.natality.fertilityRatesData.length === 0) {
                for(var i=1; i < natalityHeaderData.length - 1; i++) {
                    stateRow.push('Not available');
                    nationalRow.push('Not available');
                }
            }
            natalityData.push(stateRow);
            natalityData.push(nationalRow);


            //---vaginalData--
            stateRow = [{text:'Vaginal rates', rowSpan: 2}, 'State'];
            nationalRow = ["", "National"];
            angular.forEach(fsc.factSheet.natality.vaginalData, function(data, index){
                if(data.name !== 'Unknown') {
                    stateRow.push(fsc.calculateRate(data.natality, fsc.factSheet.natality.totalBirthPopulation[index].natality));
                    nationalRow.push(fsc.calculateRate($rootScope.nationalFactSheet.natality.vaginalData[index].natality,
                        $rootScope.nationalFactSheet.natality.totalBirthPopulation[index].natality));
                }
            });
            if (fsc.factSheet.natality.vaginalData.length === 0) {
                for(var i=1; i < natalityHeaderData.length - 1; i++) {
                    stateRow.push('Not available');
                    nationalRow.push('Not available');
                }
            }
            natalityData.push(stateRow);
            natalityData.push(nationalRow);


            //---cesareanData--
            stateRow = [{text:'Cesarean rates', rowSpan: 2}, 'State'];
            nationalRow = ["", "National"];
            angular.forEach(fsc.factSheet.natality.cesareanData, function(data, index){
                if(data.name !== 'Unknown') {
                    stateRow.push(fsc.calculateRate(data.natality, fsc.factSheet.natality.totalBirthPopulation[index].natality));
                    nationalRow.push(fsc.calculateRate($rootScope.nationalFactSheet.natality.cesareanData[index].natality,
                        $rootScope.nationalFactSheet.natality.totalBirthPopulation[index].natality));
                }
            });
            if (fsc.factSheet.natality.cesareanData.length === 0) {
                for(var i=1; i < natalityHeaderData.length - 1; i++) {
                    stateRow.push('Not available');
                    nationalRow.push('Not available');
                }
            }
            natalityData.push(stateRow);
            natalityData.push(nationalRow);

            //---lowBirthWeightData--
            stateRow = [{text:'Low birth weight (<2500 gms)', rowSpan: 2}, 'State'];
            nationalRow = ["", "National"];
            angular.forEach(fsc.factSheet.natality.lowBirthWeightData, function(data, index){
                if(data.name !== 'Unknown') {
                    stateRow.push(fsc.calculateRate(data.natality, fsc.factSheet.natality.totalBirthPopulation[index].natality));
                    nationalRow.push(fsc.calculateRate($rootScope.nationalFactSheet.natality.lowBirthWeightData[index].natality,
                        $rootScope.nationalFactSheet.natality.totalBirthPopulation[index].natality));
                }
            });
            if (fsc.factSheet.natality.lowBirthWeightData.length === 0) {
                for(var i=1; i < natalityHeaderData.length - 1; i++) {
                    stateRow.push('Not available');
                    nationalRow.push('Not available');
                }
            }
            natalityData.push(stateRow);
            natalityData.push(nationalRow);



            return {
                headerData:  natalityHeaderData,
                bodyData: natalityData
            };
        }
        /**
         * To prepare all table data for PDF generation
         * @return all table data JSON
         */
        function prepareMinorityTablesData() {
            var allTablesData = {};
            //Prepare bridgeRace data
            var bridgeRaceTableOneStateData = [], bridgeRaceTableOneNationalData = [];
            bridgeRaceTableOneStateData.push('State Population');
            angular.forEach(fsc.factSheet.race, function(race){
                bridgeRaceTableOneStateData.push($filter('number')(race.bridge_race));
            });
            bridgeRaceTableOneNationalData.push('National Population');
            angular.forEach($rootScope.nationalFactSheet.race, function(race){
                bridgeRaceTableOneNationalData.push($filter('number')(race.bridge_race));
            });
            var bridgeRaceTableTwoData = [];
            angular.forEach(fsc.populationTableEntries, function(eachPopulation, index){
                bridgeRaceTableTwoData.push([eachPopulation[0], eachPopulation[1], eachPopulation[2], eachPopulation[3],
                    eachPopulation[4], eachPopulation[5], eachPopulation[6] ]);
            });

            allTablesData.bridgeRaceTable1 = {
                headerData: fsc.minorityFactSheet.tableHeaders.population,
                bodyData: [bridgeRaceTableOneStateData, bridgeRaceTableOneNationalData]
            };
            allTablesData.bridgeRaceTable1.bodyData = prepareTableBody(allTablesData.bridgeRaceTable1.bodyData);
            allTablesData.bridgeRaceTable1.bodyData.unshift(prepareTableHeaders(allTablesData.bridgeRaceTable1.headerData));

            // var detailedMortalityHeaderData = ['Cause of Death', "State/National"];
            // angular.forEach(fsc.factSheet.detailMortalityData[0].data, function(eachHeader) {
            //     if(eachHeader.name != 'Unknown') {
            //         detailedMortalityHeaderData.push(eachHeader.name);
            //     }
            // });

            var detailsMortalityData = [];
            angular.forEach(fsc.factSheet.detailMortalityData, function(eachRecord, index){
                var stateRow = [{text:eachRecord.causeOfDeath, rowSpan: 2}, 'State'];
                var nationalRow = ["", "National"];
                angular.forEach(eachRecord.data, function(data, index){
                    if(data.name !== 'Unknown') {
                        stateRow.push(fsc.calculateRate(data.deaths, data.standardPop));
                    }
                });
                angular.forEach($rootScope.nationalFactSheet.detailMortalityData[index].data, function(nationalData, j) {
                    if(nationalData.name !== 'Unknown') {
                        nationalRow.push(fsc.calculateRate(nationalData.deaths, nationalData.standardPop));
                    }
                });
                if (eachRecord.data.length === 0) {
                    for(var i=1; i < fsc.minorityFactSheet.tableHeaders.detailedMortality.length - 2; i++) {
                        stateRow.push('Not available');
                        nationalRow.push('Not available');
                    }
                }
                detailsMortalityData.push(stateRow);
                detailsMortalityData.push(nationalRow);
            });
            allTablesData.detailMortality = {
                headerData:  fsc.minorityFactSheet.tableHeaders.detailedMortality,
                bodyData: detailsMortalityData
            };

            // //Infant Mortality

            // var infantMortalityHeaderData = ['Indicator', "State/National"];
            // angular.forEach(fsc.factSheet.infantMortalityData, function(eachHeader, key) {
            //     if(eachHeader.name != 'Unknown') {
            //         infantMortalityHeaderData.push(key);
            //     }
            // });

            var infantMortalityData = [];
            var deathRateStateRow = [{text:"Death rate", rowSpan: 2}, 'State'];
            var deathRateNationalRow = ["", "National"];
            angular.forEach(fsc.factSheet.infantMortalityData, function(eachRecord, key){
                deathRateStateRow.push($filter('number')(eachRecord.deathRate, 1));
                deathRateNationalRow.push($filter('number')($rootScope.nationalFactSheet.infantMortalityData[key].deathRate, 1));
            });
            infantMortalityData.push(deathRateStateRow);
            infantMortalityData.push(deathRateNationalRow);
            allTablesData.infantMortality = {
                headerData:  fsc.minorityFactSheet.tableHeaders.infantMortality,
                bodyData: infantMortalityData
            };

            // //PRAMS
            // var pramsTableData = [];
            // angular.forEach(fsc.factSheet.prams, function(eachRecord, index){
            //     pramsTableData.push([eachRecord.question, fsc.getMeanDisplayValue(eachRecord.data),
            //         fsc.getMeanDisplayValue($rootScope.nationalFactSheet.prams[index].data)]);
            // });
            // allTablesData.pramsTable = {
            //     headerData: ['Question', 'State', 'National'],
            //     bodyData: pramsTableData
            // };

            //BRFSS
            // var brfssHeaderData = ['Question'];
            // angular.forEach(fsc.minorityFactSheet.tableHeaders.brfss, function(eachHeader) {
            //     if(eachHeader.name != 'Unknown') {
            //         brfssHeaderData.push(eachHeader);
            //     }
            // });

            var brfssData = [];
            angular.forEach(fsc.factSheet.brfss, function(eachRecord, index){
                var stateRow = [{text:eachRecord.question, rowSpan: 2}, 'State'];
                var nationalRow = ["", "National"];

                if(eachRecord.data!='Not applicable') {
                    angular.forEach(eachRecord.data, function(data, index){
                        if(data.name !== 'Unknown') {
                            stateRow.push(fsc.getMeanDisplayValue(data.brfss.mean));
                        }
                    });
                } else {
                    for(var i=0; i < fsc.minorityFactSheet.tableHeaders.brfss.length-2; i++) {
                        stateRow.push('Not available');
                    }
                }
                if($rootScope.nationalFactSheet.brfss[index].data!='Not applicable') {
                    angular.forEach($rootScope.nationalFactSheet.brfss[index].data, function(nationalData, j) {
                        if(nationalData.name !== 'Unknown') {
                            nationalRow.push(fsc.getMeanDisplayValue(nationalData.brfss.mean));
                        }
                    });
                } else {
                    for(var i=0; i < fsc.minorityFactSheet.tableHeaders.brfss.length-2; i++) {
                        nationalRow.push('Not available');
                    }
                }
                brfssData.push(stateRow);
                brfssData.push(nationalRow);
            });
            allTablesData.brfss = {
                headerData:  fsc.minorityFactSheet.tableHeaders.brfss,
                bodyData: brfssData
            };

            //YRBS
            // var yrbsData = [];
            // angular.forEach(fsc.factSheet.yrbs, function(eachRecord, index){
            //     yrbsData.push([eachRecord.question, fsc.getMeanDisplayValue(eachRecord.data),
            //         fsc.getMeanDisplayValue($rootScope.nationalFactSheet.yrbs[index].data)]);
            // });
            // allTablesData.yrbs = {
            //     headerData: ["Question", "State", "National"],
            //     bodyData: yrbsData
            // };
            //Natality
            allTablesData.natality = prepareMinorityNatalityData();

            //Tuberculosis
            // var tbHeaderData = [""];
            // var tbData = [];
            // angular.forEach(fsc.factSheet.tuberculosis, function(eachRecord, index) {
            //     if(eachRecord.name !== 'Unknown') {
            //         tbHeaderData.push(eachRecord.name);
            //     }
            // });
            var stateData = ['State'];
            var nationalData = ['National'];
            angular.forEach(fsc.factSheet.tuberculosis, function(eachRecord, index) {
                if(eachRecord.name !== 'Unknown') {
                    stateData.push(eachRecord.rates);
                    nationalData.push($rootScope.nationalFactSheet.tuberculosis[index].rates);
                }
            });
            allTablesData.tb = {
                headerData:  fsc.minorityFactSheet.tableHeaders.tb,
                bodyData: [stateData, nationalData]
            };

            //STD
            // var stdHeaderData = ['Disease', "State/National"];
            // angular.forEach(fsc.factSheet.stdData[0].data, function(eachHeader) {
            //     if(eachHeader.name != 'Unknown') {
            //         stdHeaderData.push(eachHeader.name);
            //     }
            // });

            var stdData = [];
            angular.forEach(fsc.factSheet.stdData, function(eachRecord, index){
                var stateRow = [{text:eachRecord.disease, rowSpan: 2}, 'State'];
                var nationalRow = ["", "National"];
                angular.forEach(eachRecord.data, function(data, index){
                    if(data.name !== 'Unknown') {
                        stateRow.push((data.rates =='Suppressed' ? '': data.rates));
                    }
                });
                angular.forEach($rootScope.nationalFactSheet.stdData[index].data, function(nationalData, j) {
                    if(nationalData.name !== 'Unknown') {
                        nationalRow.push((nationalData.rates == 'Suppressed' ? '' :
                            nationalData.rates));
                    }
                });
                if (eachRecord.data.length === 0) {
                    for(var i=1; i < fsc.minorityFactSheet.tableHeaders.std.length - 1; i++) {
                        stateRow.push('Not available');
                        nationalRow.push('Not available');
                    }
                }
                stdData.push(stateRow);
                stdData.push(nationalRow);
            });
            allTablesData.std = {
                headerData:  fsc.minorityFactSheet.tableHeaders.std,
                bodyData: stdData
            };

            //HIV/AIDS
            // var hivHeaderData = ['Indicator', 'State/National'];
            // angular.forEach(fsc.factSheet.hivAIDSData[0].data, function(eachHeader, index){
            //     if(eachHeader.name !== 'Unknown') {
            //         hivHeaderData.push(eachHeader.name);
            //     }
            // });
            var hivData = [];
            angular.forEach(fsc.factSheet.hivAIDSData, function(eachRecord, index) {
                var stateRow = [{text:eachRecord.disease, rowSpan: 2}, 'State'];
                var nationalRow = ['', 'National'];
                angular.forEach(eachRecord.data, function(data){
                    if(data.name !== 'Unknown') {
                        stateRow.push((data.rates =='Suppressed' ? '': data.rates));
                    }
                });

                angular.forEach($rootScope.nationalFactSheet.hivAIDSData[index].data, function(nationalData, j) {
                    if(nationalData.name !== 'Unknown') {
                        nationalRow.push((nationalData.rates == 'Suppressed' ? '' :
                            nationalData.rates));
                    }
                });

                if (eachRecord.data.length === 0) {
                    for(var i=1; i < fsc.minorityFactSheet.tableHeaders.hiv.length - 1; i++) {
                        stateRow.push('Not available');
                        nationalRow.push('Not available');
                    }
                }
                hivData.push(stateRow);
                hivData.push(nationalRow);
            });
            allTablesData.hiv = {
                headerData:  fsc.minorityFactSheet.tableHeaders.hiv,
                bodyData: hivData
            };

            //Cancer

            var cancerHeaderData = ['Cancer Site', "State/National"];
            angular.forEach(fsc.factSheet.cancerData[0].incidence, function(eachHeader) {
                if(eachHeader.name != 'Unknown') {
                    cancerHeaderData.push(eachHeader.name);
                }
            });

            var cancerData = [];
            angular.forEach(fsc.factSheet.cancerData, function(eachRecord, index){
                var stateRow = [{text:eachRecord.site, rowSpan: 2}, 'State'];
                var nationalRow = ["", "National"];
                angular.forEach(eachRecord.incidence, function(data, index){
                    if(data.name !== 'Unknown') {
                        stateRow.push(fsc.calculateRate(data.cancer_incidence, data.pop, true));
                    }
                });
                angular.forEach($rootScope.nationalFactSheet.cancerData[index].incidence, function(nationalData, j) {
                    if(nationalData.name !== 'Unknown') {
                        nationalRow.push(fsc.calculateRate(nationalData.cancer_incidence, nationalData.pop, true));
                    }
                });
                if (eachRecord.incidence.length === 0) {
                    for(var i=1; i < cancerHeaderData.length - 1; i++) {
                        stateRow.push('Not available');
                        nationalRow.push('Not available');
                    }
                }
                cancerData.push(stateRow);
                cancerData.push(nationalRow);
            });
            allTablesData.cancer = {
                headerData:  cancerHeaderData,
                bodyData: cancerData
            };

            return allTablesData;
        }

        /**
         * Initializes the Population table entries.
         * @param displayNational
         */
        function prepareStateHealthPopulationTable() {
            fsc.populationTableEntries = [];
            var entriesTitles = ["10-14", "15-19", "20-44", "45-64", "65-84", "85+"];
            for(var i=0; i<entriesTitles.length-1;i++) {
                var tableRow = [];
                tableRow.push(entriesTitles[i]);
                tableRow.push(getPopValue(fsc.factSheet.ageGroups, i));
                tableRow.push(getPopValue($rootScope.nationalFactSheet.ageGroups, i));
                fsc.populationTableEntries.push(tableRow);
            }
        }
        function prepareWomensHealthPopulationTable() {
            fsc.populationTableEntries = [];
            var entriesTitles = ["10-14", "15-19", "20-44", "45-64", "65-84", "85+"];
            for(var i=0; i<entriesTitles.length;i++) {
                var tableRow = [];
                tableRow.push(entriesTitles[i]);
                tableRow.push(getPopValue(fsc.factSheet.ageGroups, i));
                tableRow.push(getPopValue($rootScope.nationalFactSheet.ageGroups, i));
                tableRow.push(getPopValue($rootScope.mensFactSheet.ageGroups, i));
                fsc.populationTableEntries.push(tableRow);
            }
        }
        function prepareWomensOfReproductiveAgeHealthPopulationTable() {
            fsc.populationTableEntries = [];
            fsc.deliveryFactorsEntries = [];
            var entriesTitles = ["15-19", "20-44"];
            for(var i=0; i<entriesTitles.length; i++) {
                var tableRow = [];
                tableRow.push(entriesTitles[i]);
                tableRow.push(getPopValue(fsc.factSheet.ageGroups, i, fsc.fsType));
                tableRow.push(getPopValue($rootScope.nationalFactSheet.ageGroups, i, fsc.fsType));
                fsc.populationTableEntries.push(tableRow);
            }
            for(var i=0; i<fsc.factSheet.deliveryFactorsData.length; i++) {
                var deliveryFactor = fsc.factSheet.deliveryFactorsData[i];
                for(var j=0; j<deliveryFactor.data.length; j++) {
                    var rowEntry = [];
                    if(j==0) {
                        rowEntry.push({rowSpan: deliveryFactor.data.length, value: deliveryFactor.cause});
                    }
                    rowEntry.push({value: deliveryFactor.data[j].name});
                    rowEntry.push({value:$filter('number')(deliveryFactor.data[j].natality)});
                    rowEntry.push({value:$filter('number')($rootScope.nationalFactSheet.deliveryFactorsData[i].data[j].natality)});
                    fsc.deliveryFactorsEntries.push(rowEntry);
                }
            }
        }

        function prepareMinorityHealthPopulationTable() {
            fsc.populationTableEntries = [];
            var tableRow = [];
            tableRow.push("State Population");
            for(var i=0; i<6;i++) {
                tableRow.push(getPopValue(fsc.factSheet.ageGroups, i));
            }
            fsc.populationTableEntries.push(tableRow);
            tableRow = [];
            tableRow.push("National Population");
            for(var i=0; i<6;i++) {
                tableRow.push(getPopValue($rootScope.nationalFactSheet.ageGroups, i));
            }
            fsc.populationTableEntries.push(tableRow);
        }
        function getPopValue(ageGroups, index, fsType) {
            var popValue;
            if (index==1) {
                popValue = (fsType && fsType == fsc.fsTypes.women_of_reproductive_age_health) ?
                    $filter('number')(ageGroups[1].bridge_race) :
                    $filter('number')(ageGroups[1]["15-44 years"][0].bridge_race);
            } else if (index==2) {
                popValue = (fsType && fsType == fsc.fsTypes.women_of_reproductive_age_health) ?
                    $filter('number')(ageGroups[1].bridge_race) :
                    $filter('number')(ageGroups[1]["15-44 years"][1].bridge_race);
            } else {
                popValue = $filter('number')(ageGroups[(index==0)?index:index-1].bridge_race);
            }
            return popValue;
        }

        /**
         * This function generates women's health fact sheet tables
         * @returns {{}}
         */
        function prepareWomenOfReproductiveHealthTabledData() {
            var allTablesData = {};
            //bridgeRace table1 data
            var bridgeRaceTable1Data = ['Population'];
            bridgeRaceTable1Data.push($filter('number')(fsc.factSheet.totalGenderPop));
            bridgeRaceTable1Data.push($filter('number')($rootScope.nationalFactSheet.totalGenderPop));

            allTablesData.bridgeRaceTable1 = {
                headerData: ['Distribution Residents', 'State Population', 'National Population'],
                bodyData: bridgeRaceTable1Data
            };

            //bridgeRace table2 data
            var bridgeRaceTable2Data = [];
            angular.forEach(fsc.populationTableEntries, function(populationEntry){
                bridgeRaceTable2Data.push(populationEntry);
            });

            allTablesData.bridgeRaceTable2 = {
                headerData: ['Age Distribution of Residents', 'State Population (Women)', 'National Population (Women)'],
                bodyData: bridgeRaceTable2Data
            };

            //Detail Mortality
            var detailsMortalityData = [];
            angular.forEach(fsc.factSheet.detailMortalityData, function(eachRecord, index){
                var deathCount = "", nationalDeathCount = "", mensDeathCount="";
                if(eachRecord.data.deaths){
                    deathCount = eachRecord.data.deaths === 'suppressed' ? 'Suppressed' : $filter('number')(eachRecord.data.deaths);
                }
                if($rootScope.nationalFactSheet.detailMortalityData[index].data.deaths) {
                    nationalDeathCount = $rootScope.nationalFactSheet.detailMortalityData[index].data.deaths === 'suppressed'
                        ? 'Suppressed' : $filter('number')($rootScope.nationalFactSheet.detailMortalityData[index].data.deaths);
                }

                detailsMortalityData.push([eachRecord.causeOfDeath, deathCount, nationalDeathCount,
                    eachRecord.data.ageAdjustedRate ? eachRecord.data.ageAdjustedRate : "Not available",
                    $rootScope.nationalFactSheet.detailMortalityData[index].data.ageAdjustedRate ?
                        $rootScope.nationalFactSheet.detailMortalityData[index].data.ageAdjustedRate : "Not available"
                ]);
            });
            allTablesData.detailMortality = {
                headerData: [{header: 'Cause of Death'}, {header:'Number of Deaths', nestedHeaders: ['State (Women)','National (Women)']},
                    {header:'Age-Adjusted Death Rate (per 100,000)',nestedHeaders: ['State (Women)', 'National (Women)']}],
                bodyData: detailsMortalityData
            };

            //PRAMS
            var pramsTableData = [];
            angular.forEach(fsc.factSheet.prams, function(eachRecord, index){
                pramsTableData.push([eachRecord.question, eachRecord.data, $rootScope.nationalFactSheet.prams[index].data]);
            });
            allTablesData.pramsTable = {
                headerData: ['', 'State (Women)', 'National (Women)'],
                bodyData: pramsTableData
            };

            //Delivery factors
            var deliveryFactorsData = [];
            angular.forEach(fsc.deliveryFactorsEntries, function(eachRecord, index){
                var eachRow = [];
                if(utilService.findByKey(eachRecord, 'rowSpan') == null) {
                    eachRow.push({text: '', style: 'table', border: [true, false, false, fsc.deliveryFactorsEntries.length-1==index]})
                }
                angular.forEach(eachRecord, function(eachValue, index) {
                    if(eachValue['rowSpan']) {
                        eachRow.push({text: eachValue['value'], style: 'table',
                            border: [true, true, true, false], rowspan: eachValue['rowSpan']})
                    }else{
                        eachRow.push({text: eachValue['value'], style: 'table',
                            border: [true, true, true, true]})
                    }
                });
                deliveryFactorsData.push(eachRow);
            });

            allTablesData.deliveryFactorsTableData = {
                headerData: ['', '', 'State', 'National'],
                bodyData: deliveryFactorsData
            };

            //natality
            var natalityTableData = [];
            angular.forEach(fsc.factSheet.natality, function(eachRecord, index){
                natalityTableData.push([eachRecord.cause, $filter('number')(eachRecord.data),
                    $filter('number')($rootScope.nationalFactSheet.natality[index].data)]);
            });
            allTablesData.natalityTable = {
                headerData: ['', 'State', 'National'],
                bodyData: natalityTableData
            };

            //BRFSS
            var brfssData = [];
            angular.forEach(fsc.factSheet.brfss, function(eachRecord, index){
                brfssData.push([eachRecord.question, eachRecord.data]);
            });
            allTablesData.brfss = {
                headerData: ['', 'State (Women)'],
                bodyData: brfssData
            };

            return allTablesData;
        }

        /**
         * This function generates women's health fact sheet tables
         * @returns {{}}
         */
        function prepareWomenHealthTabledData() {
            var allTablesData = {};
            //bridgeRace table1 data
            var bridgeRaceTable1Data = ['Population'];
            bridgeRaceTable1Data.push($filter('number')(fsc.factSheet.totalGenderPop));
            bridgeRaceTable1Data.push($filter('number')($rootScope.nationalFactSheet.totalGenderPop));
            bridgeRaceTable1Data.push($filter('number')($rootScope.mensFactSheet.totalGenderPop));

            allTablesData.bridgeRaceTable1 = {
                headerData: ['Distribution Residents', 'State Population (Women)', 'National Population (Women)','State Population (Men)'],
                bodyData: bridgeRaceTable1Data
            };

            //bridgeRace table2 data
            var bridgeRaceTable2Data = [];
            angular.forEach(fsc.populationTableEntries, function(populationEntry){
                bridgeRaceTable2Data.push(populationEntry);
            });

            allTablesData.bridgeRaceTable2 = {
                headerData: ['Age Distribution of Residents', 'State Population (Women)', 'National Population (Women)','State Population (Men)'],
                bodyData: bridgeRaceTable2Data
            };

            //Detail Mortality
            var detailsMortalityData = [];
            angular.forEach(fsc.factSheet.detailMortalityData, function(eachRecord, index){
                var deathCount = "", nationalDeathCount = "", mensDeathCount="";
                if(eachRecord.data.deaths){
                    deathCount = eachRecord.data.deaths === 'suppressed' ? 'Suppressed' : $filter('number')(eachRecord.data.deaths);
                }
                if($rootScope.nationalFactSheet.detailMortalityData[index].data.deaths) {
                    nationalDeathCount = $rootScope.nationalFactSheet.detailMortalityData[index].data.deaths === 'suppressed'
                        ? 'Suppressed' : $filter('number')($rootScope.nationalFactSheet.detailMortalityData[index].data.deaths);
                }
                if($rootScope.mensFactSheet.detailMortalityData[index].data.deaths) {
                    mensDeathCount = $rootScope.mensFactSheet.detailMortalityData[index].data.deaths === 'suppressed'
                        ? 'Suppressed' : $filter('number')($rootScope.mensFactSheet.detailMortalityData[index].data.deaths);
                }

                detailsMortalityData.push([eachRecord.causeOfDeath, deathCount, nationalDeathCount, mensDeathCount,
                    eachRecord.data.ageAdjustedRate ? eachRecord.data.ageAdjustedRate : "Not available",
                    $rootScope.nationalFactSheet.detailMortalityData[index].data.ageAdjustedRate ?
                        $rootScope.nationalFactSheet.detailMortalityData[index].data.ageAdjustedRate : "Not available",
                    $rootScope.mensFactSheet.detailMortalityData[index].data.ageAdjustedRate ?
                        $rootScope.mensFactSheet.detailMortalityData[index].data.ageAdjustedRate : "Not available"
                ]);
            });
            allTablesData.detailMortality = {
                headerData: [{header: 'Cause of Death'}, {header:'Number of Deaths', nestedHeaders: ['State (Women)','National (Women)','State (Men)']},
                    {header:'Age-Adjusted Death Rate (per 100,000)',nestedHeaders: ['State (Women)', 'National (Women)','State (Men)']}],
                bodyData: detailsMortalityData
            };

            //PRAMS
            var pramsTableData = [];
            angular.forEach(fsc.factSheet.prams, function(eachRecord, index){
                pramsTableData.push([eachRecord.question, eachRecord.data, $rootScope.nationalFactSheet.prams[index].data]);
            });
            allTablesData.pramsTable = {
                headerData: ['', 'State (Women)', 'National (Women)'],
                bodyData: pramsTableData
            };

            //PRAMS
            var natalityTableData = [];
            angular.forEach(fsc.factSheet.natality, function(eachRecord, index){
                natalityTableData.push([eachRecord.cause, $filter('number')(eachRecord.data),
                    $filter('number')($rootScope.nationalFactSheet.natality[index].data)]);
            });
            allTablesData.natalityTable = {
                headerData: ['', 'State', 'National'],
                bodyData: natalityTableData
            };

            //BRFSS
            var brfssData = [];
            angular.forEach(fsc.factSheet.brfss, function(eachRecord, index){
                brfssData.push([eachRecord.question, eachRecord.data,
                    $rootScope.mensFactSheet.brfss[index].data]);
            });
            allTablesData.brfss = {
                headerData: ['', 'State (Women)', 'State (Men)'],
                bodyData: brfssData
            };

            //YRBS
            var yrbsData = [];
            angular.forEach(fsc.factSheet.yrbs, function(eachRecord, index){
                yrbsData.push([eachRecord.question, eachRecord.data, $rootScope.nationalFactSheet.yrbs[index].data,
                    $rootScope.mensFactSheet.yrbs[index].data]);
            });
            allTablesData.yrbsTable = {
                headerData: ["", "State (Girls)", "National (Girls)",'State (Men)'],
                bodyData: yrbsData
            };

            //STD
            var stdHeaderData =  [{header: 'Disease'}, {header:'State (Women)', nestedHeaders: ['Total Cases','Rate']},
                {header:'National (Women)',nestedHeaders: ['Total Cases', 'Rate']},
                {header:'State (Men)',nestedHeaders: ['Total Cases', 'Rate']}];
            var stdData = [];

            angular.forEach(fsc.factSheet.stdData, function(eachRecord, index){
                var eachRow = [];
                eachRow.push(eachRecord.disease);
                eachRow.push($filter('number')(eachRecord.data.std));
                eachRow.push(fsc.calculateRate(eachRecord.data.std, eachRecord.data.pop));

                eachRow.push($filter('number')($rootScope.nationalFactSheet.stdData[index].data.std));
                eachRow.push(fsc.calculateRate($rootScope.nationalFactSheet.stdData[index].data.std,
                    $rootScope.nationalFactSheet.stdData[index].data.pop));

                eachRow.push($filter('number')($rootScope.mensFactSheet.stdData[index].data.std));
                eachRow.push(fsc.calculateRate($rootScope.mensFactSheet.stdData[index].data.std,
                    $rootScope.mensFactSheet.stdData[index].data.pop));
                stdData.push(eachRow);
            });
            allTablesData.std = {
                headerData: stdHeaderData,
                bodyData: stdData
            };

            //HIV/AIDS
            var hivHeaderData =  [{header: 'Indicator'}, {header:'State (Women)', nestedHeaders: ['Total Cases','Rate']},
                {header:'National (Women)',nestedHeaders: ['Total Cases', 'Rate']},
                {header:'State (Men)',nestedHeaders: ['Total Cases', 'Rate']}];
            var hivData = [];
            angular.forEach(fsc.factSheet.hivAIDSData, function(eachRecord, index) {
                var eachRow = [];
                eachRow.push(eachRecord.disease);
                eachRow.push($filter('number')(eachRecord.data.aids));
                eachRow.push(fsc.calculateRate(eachRecord.data.aids, eachRecord.data.pop));

                eachRow.push($filter('number')($rootScope.nationalFactSheet.hivAIDSData[index].data.aids));
                eachRow.push(fsc.calculateRate($rootScope.nationalFactSheet.hivAIDSData[index].data.aids,
                    $rootScope.nationalFactSheet.hivAIDSData[index].data.pop));

                eachRow.push($filter('number')($rootScope.mensFactSheet.hivAIDSData[index].data.aids));
                eachRow.push(fsc.calculateRate($rootScope.mensFactSheet.hivAIDSData[index].data.aids,
                    $rootScope.mensFactSheet.hivAIDSData[index].data.pop));

                hivData.push(eachRow);
            });
            allTablesData.hiv = {
                headerData:  hivHeaderData,
                bodyData: hivData
            };

            //Cancer
            var cancerHeaderData =  [{header: 'Cancer Site'}, {header:'State (Women)', nestedHeaders:
                    ['Incidence Crude Rates (per 100,000)','Mortality Crude Rates (per 100,000)']}, {header:'National (Women)',
                nestedHeaders: ['Incidence Crude Rates (per 100,000)', 'Mortality Crude Rates (per 100,000)']}, {header:'State (Men)',
                nestedHeaders: ['Incidence Crude Rates (per 100,000)', 'Mortality Crude Rates (per 100,000)']}];

            var cancerData = [];
            angular.forEach(fsc.factSheet.cancerData, function(eachRecord, index) {
                var aRow = [
                    eachRecord.site,
                    fsc.calculateRate(eachRecord.incidence.cancer_incidence, eachRecord.incidence.pop, true),
                    fsc.calculateRate(eachRecord.mortality.cancer_mortality, eachRecord.mortality.pop, true),
                    fsc.calculateRate($rootScope.nationalFactSheet.cancerData[index].incidence.cancer_incidence,
                        $rootScope.nationalFactSheet.cancerData[index].incidence.pop, true),
                    fsc.calculateRate($rootScope.nationalFactSheet.cancerData[index].mortality.cancer_mortality,
                        $rootScope.nationalFactSheet.cancerData[index].mortality.pop, true)];

                if($rootScope.mensFactSheet.cancerData[index].incidence)
                    aRow.push(fsc.calculateRate($rootScope.mensFactSheet.cancerData[index].incidence.cancer_incidence,
                        $rootScope.mensFactSheet.cancerData[index].incidence.pop, true));
                else
                    aRow.push('Not available');
                if($rootScope.mensFactSheet.cancerData[index].mortality)
                    aRow.push(fsc.calculateRate($rootScope.mensFactSheet.cancerData[index].mortality.cancer_mortality,
                        $rootScope.mensFactSheet.cancerData[index].mortality.pop, true));
                else
                    aRow.push('Not available');
                cancerData.push(aRow);
            });
            allTablesData.cancer = {
                headerData:  cancerHeaderData,
                bodyData: cancerData
            };
            return allTablesData;
        }

        /**
         * To prepare all table data for state health fact sheet PDF generation
         * @return all table data JSON
         */
        function prepareStateHelthTablesData(){
            var allTablesData = {};
            //Prepare bridgeRace data
            var bridgeRaceTableOneData = [];
            bridgeRaceTableOneData.push('Population');
            // fsc.fsTypeForTable !== fsc.fsTypes.womens_health && bridgeRaceTableOneData.push($filter('number')(fsc.factSheet.totalGenderPop));
            // angular.forEach(fsc.factSheet.race, function(race){
            //     bridgeRaceTableOneData.push($filter('number')(race.bridge_race));
            // });
            bridgeRaceTableOneData.push($filter('number')(fsc.factSheet.totalGenderPop));
            bridgeRaceTableOneData.push($filter('number')($rootScope.nationalFactSheet.totalGenderPop));

            var bridgeRaceTableTwoData = [];
            angular.forEach(fsc.populationTableEntries, function(eachPopulation, index){
                bridgeRaceTableTwoData.push([eachPopulation[0], eachPopulation[1], eachPopulation[2]]);
            });

            if(fsc.fsTypeForTable === fsc.fsTypes.womens_health) {
                allTablesData.bridgeRaceTable1 = {
                    headerData: ['Racial Distributions of Residents', 'Black, non-Hispanic', 'White, non-Hispanic', 'American Indian or Alaska Native', 'Asian or Pacific Islander', 'Hispanic'],
                    bodyData: bridgeRaceTableOneData
                };
            }
            else {
                allTablesData.bridgeRaceTable1 = {
                    headerData: ['Distributions of Residents', 'State Population', 'National Population'],
                    bodyData: bridgeRaceTableOneData
                };
            }

            allTablesData.bridgeRaceTable2 = {
                headerData: ['Age Distributions of Residents', 'State Population', 'National Population'],
                bodyData: bridgeRaceTableTwoData
            };
            //Detail Mortality
            var detailsMortalityData = [];
            angular.forEach(fsc.factSheet.detailMortalityData, function(eachRecord, index){
                var deathCount = "", nationalDeathCount = "";
                if(eachRecord.data.deaths){
                    deathCount = eachRecord.data.deaths === 'suppressed' ? 'Suppressed' : $filter('number')(eachRecord.data.deaths);
                }
                if($rootScope.nationalFactSheet.detailMortalityData[index].data.deaths) {
                    nationalDeathCount = $rootScope.nationalFactSheet.detailMortalityData[index].data.deaths === 'suppressed'
                        ? 'Suppressed' : $filter('number')($rootScope.nationalFactSheet.detailMortalityData[index].data.deaths);
                }

                detailsMortalityData.push([eachRecord.causeOfDeath, deathCount, nationalDeathCount,
                    eachRecord.data.ageAdjustedRate ? eachRecord.data.ageAdjustedRate : "Not available",
                    $rootScope.nationalFactSheet.detailMortalityData[index].data.ageAdjustedRate ?
                        $rootScope.nationalFactSheet.detailMortalityData[index].data.ageAdjustedRate : "Not available"
                ]);
            });
            allTablesData.detailMortality = {
                headerData: [{header: 'Cause of Death'}, {header:'Number of Deaths', nestedHeaders: ['State','National']},
                    {header:'Age-Adjusted Death Rate (per 100,000)',nestedHeaders: ['State', 'National']}],
                bodyData: detailsMortalityData
            };


            var infantMortalityMetaObj = [{"Deaths": "infant_mortality"}, {"Births": "births"}, {"Death rates": "deathRate"}];
            var infantMortalityData = [];
            angular.forEach(infantMortalityMetaObj, function(eachObj){
                var eachKey = Object.keys(eachObj)[0];
                infantMortalityData.push([eachKey, $filter('number')(fsc.factSheet.infantMortalityData[eachObj[eachKey]]),
                    $filter('number')($rootScope.nationalFactSheet.infantMortalityData[eachObj[eachKey]])]);
            });
            //Infant Mortality
            allTablesData.infantMortality = {
                headerData: ['Indicator', 'State', 'National'],
                bodyData: infantMortalityData
            };
            //PRAMS
            var pramsTableData = [];
            angular.forEach(fsc.factSheet.prams, function(eachRecord, index){
                pramsTableData.push([eachRecord.question, eachRecord.data, $rootScope.nationalFactSheet.prams[index].data]);
            });
            allTablesData.pramsTable = {
                headerData: ['', 'State', 'National'],
                bodyData: pramsTableData
            };

            //BRFSS
            var brfssData = [];
            angular.forEach(fsc.factSheet.brfss, function(eachRecord, index){
                brfssData.push([eachRecord.question, eachRecord.data, $rootScope.nationalFactSheet.brfss[index].data]);
            });
            allTablesData.brfss = {
                headerData: ['', 'State', 'National'],
                bodyData: brfssData
            };
            //YRBS
            var yrbsData = [];
            angular.forEach(fsc.factSheet.yrbs, function(eachRecord, index){
                yrbsData.push([eachRecord.question, eachRecord.data, $rootScope.nationalFactSheet.yrbs[index].data]);
            });
            allTablesData.yrbs = {
                headerData: ["", "State", "National"],
                bodyData: yrbsData
            };
            //Natality
            allTablesData.natality = {
                headerData: ["", "State", "National"],
                bodyData: [["Births", $filter('number')(fsc.factSheet.natalityData.births), $filter('number')($rootScope.nationalFactSheet.natalityData.births)],
                    ["Birth rates (per 100,000)", fsc.factSheet.natalityData.birthRate, $rootScope.nationalFactSheet.natalityData.birthRate],
                    ["Female  population (Ages 15 to 44)", $filter('number')(fsc.factSheet.natalityData.femalePopulation), $filter('number')($rootScope.nationalFactSheet.natalityData.femalePopulation)],
                    ["Fertility rates (per 100,000)", fsc.factSheet.natalityData.fertilityRate, $rootScope.nationalFactSheet.natalityData.fertilityRate],
                    ['Vaginal rates', fsc.factSheet.natalityData.vaginalRate, $rootScope.nationalFactSheet.natalityData.vaginalRate],
                    ['Cesarean rates', fsc.factSheet.natalityData.cesareanRate, $rootScope.nationalFactSheet.natalityData.cesareanRate],
                    ['Low birth weight (<2500 gms)', fsc.factSheet.natalityData.lowBirthWeightRate, $rootScope.nationalFactSheet.natalityData.lowBirthWeightRate],
                    ['Twin birth rate', fsc.factSheet.natalityData.twinBirthRate, $rootScope.nationalFactSheet.natalityData.twinBirthRate]
                ]
            };
            //Tuberculosis
            var tbHeaderData = ["", "State", "National"];
            var tbTotalCasesData = [], tbRates = [];

            if(fsc.factSheet.tuberculosis[0].name != 'Unknown') {
                tbTotalCasesData.push("Total Cases");
                tbTotalCasesData.push(fsc.factSheet.tuberculosis[0].displayValue);
                tbTotalCasesData.push($rootScope.nationalFactSheet.tuberculosis[0].displayValue);
                tbRates.push("Rates");
                tbRates.push(fsc.factSheet.tuberculosis[0].rate);
                tbRates.push($rootScope.nationalFactSheet.tuberculosis[0].rate);

            }
            allTablesData.tb = {
                headerData:  tbHeaderData,
                bodyData: [tbTotalCasesData, tbRates]
            };
            //STD
            var stdHeaderData =  [{header: 'Disease'}, {header:'State', nestedHeaders: ['Total Cases','Rate']},
                {header:'National',nestedHeaders: ['Total Cases', 'Rate']}];
            var stdData = [];


            angular.forEach(fsc.factSheet.stdData, function(eachRecord, index){
                var eachRow = [];
                eachRow.push(eachRecord.disease);
                angular.forEach(eachRecord.data, function (eachData, j) {
                    if( eachData.name != 'Unknown'  && j == 0 ) {
                        eachRow.push(eachData.displayValue);
                        eachRow.push(eachData.rate);
                    }
                });
                angular.forEach($rootScope.nationalFactSheet.stdData[index].data, function (eachNationalData, i) {
                    if( eachNationalData.name != 'Unknown'  && i == 0 ) {
                        eachRow.push(eachNationalData.displayValue);
                        eachRow.push(eachNationalData.rate);
                    }
                });
                stdData.push(eachRow);
            });

            allTablesData.std = {
                headerData:  stdHeaderData,
                bodyData: stdData
            };
            //HIV/AIDS
            var hivHeaderData =  [{header: 'Indicator'}, {header:'State', nestedHeaders: ['Total Cases','Rate']},
                {header:'National',nestedHeaders: ['Total Cases', 'Rate']}];
            var hivData = [];
            angular.forEach(fsc.factSheet.hivAIDSData, function(eachRecord, index) {
                var eachRow = [];
                eachRow.push(eachRecord.disease);
                angular.forEach(eachRecord.data, function (eachData, j) {
                    if( eachData.name != 'Unknown'  && j == 0 ) {
                        eachRow.push(eachData.displayValue);
                        eachRow.push(eachData.rate);
                    }
                });
                angular.forEach($rootScope.nationalFactSheet.hivAIDSData[index].data, function (eachNationalData, i) {
                    if( eachNationalData.name != 'Unknown'  && i == 0 ) {
                        eachRow.push(eachNationalData.displayValue);
                        eachRow.push(eachNationalData.rate);
                    }
                });
                hivData.push(eachRow);
            });
            allTablesData.hiv = {
                headerData:  hivHeaderData,
                bodyData: hivData
            };

            //Cancer
            var cancerData = [];
            var cancerHeaderData =  [{header: 'Cancer Site'}, {header:'State', nestedHeaders:
                    ['Incidence Crude Rates (per 100,000)','Mortality Crude Rates (per 100,000)']}, {header:'National',
                nestedHeaders: ['Incidence Crude Rates (per 100,000)', 'Mortality Crude Rates (per 100,000)']}];
            angular.forEach(fsc.factSheet.cancerData, function(eachRecord, index) {
                var eachRow = [];
                eachRow.push(eachRecord.site);
                eachRow.push(eachRecord.incident_rate);
                eachRow.push(eachRecord.mortality_rate);
                eachRow.push($rootScope.nationalFactSheet.cancerData[index].incident_rate);
                eachRow.push($rootScope.nationalFactSheet.cancerData[index].mortality_rate);
                cancerData.push(eachRow);
            });
            allTablesData.cancer = {
                headerData:  cancerHeaderData,
                bodyData: cancerData
            };
            return allTablesData;
        }

        /**
         * To export factsheet data into PDF
         */
        function exportMinorityFactSheet() {
            //We can pass multiple images to 'SVGtoPNG' method to generate dataURL
            var imageNamesForPDF = ["../client/app/images/state-shapes/"+fsc.stateImg];
            SearchService.SVGtoPNG(imageNamesForPDF).then(function(response){
                var allTablesData = prepareMinorityTablesData();

                var detailMortalityTableData = allTablesData.detailMortality.bodyData;
                detailMortalityTableData.unshift(prepareTableHeaders(allTablesData.detailMortality.headerData));

                var infantMortalityTableData = allTablesData.infantMortality.bodyData;
                infantMortalityTableData.unshift(prepareTableHeaders(allTablesData.infantMortality.headerData));

                var brfssTableData = allTablesData.brfss.bodyData;
                brfssTableData.unshift(prepareTableHeaders(allTablesData.brfss.headerData));

                // allTablesData.pramsTable.bodyData = prepareTableBody(allTablesData.pramsTable.bodyData);
                // allTablesData.pramsTable.bodyData.unshift(prepareTableHeaders(allTablesData.pramsTable.headerData));
                //
                // allTablesData.yrbs.bodyData = prepareTableBody(allTablesData.yrbs.bodyData);
                // allTablesData.yrbs.bodyData.unshift(prepareTableHeaders(allTablesData.yrbs.headerData));

                var natalityTableData = allTablesData.natality.bodyData;
                natalityTableData.unshift(prepareTableHeaders(allTablesData.natality.headerData));

                allTablesData.tb.bodyData = prepareTableBody(allTablesData.tb.bodyData);
                allTablesData.tb.bodyData.unshift(prepareTableHeaders(allTablesData.tb.headerData));

                var stdTableData = allTablesData.std.bodyData;
                stdTableData.unshift(prepareTableHeaders(allTablesData.std.headerData));

                var hivTableData = allTablesData.hiv.bodyData;
                hivTableData.unshift(prepareTableHeaders(allTablesData.hiv.headerData));

                var cancerTableData = allTablesData.cancer.bodyData;
                cancerTableData.unshift(prepareTableHeaders(allTablesData.cancer.headerData));

                var bridgeRaceTotalText = "Total minority state population: "+$filter('number')(fsc.factSheet.totalPop);
                var lightHorizontalLines = {
                    hLineWidth: function (i, node) {
                        return .5;
                    },
                    vLineWidth: function (i, node) {
                        return .5;
                    },
                    hLineColor: 'gray',
                    vLineColor: 'gray'
                };
                var pdfDefinition = {
                    styles: {
                        "dataset-image": {
                            alignment: 'left',
                            margin: [0, 0, 55, -35]
                        },
                        "state-image": {
                            alignment: 'left',
                            margin: [0, 0, 55, -35]
                        },
                        "state-heading": {
                            fontSize: 16,
                            alignment: 'left',
                            margin: [50, 0, 0, 0]
                        },
                        "footer": {
                            fontSize: 5,
                            italics: true
                        },
                        "footerLink": {
                            fontSize: 5,
                            color: '#6f399a',
                            italics: true
                        },
                        heading: {
                            fontSize: 10,
                            bold: true,
                            decoration: 'underline',
                            margin: [50, 5, 0, 10]
                        },
                        underline: {
                            decoration: 'underline'
                        },
                        "tableHeader": {
                            bold: true
                        },
                        table: {
                            margin: [0, 2, 0, 2]
                        },
                        'info': {
                            fontSize: 6,
                            italics: true,
                            margin: [0, 1, 0, 0]
                        },
                        'factsheet-def': {
                            margin: [0, 20, 0, 0]
                        }
                    },
                    defaultStyle: {
                        fontSize: 8
                    }
                };
                //Prepare source for PRAMS, YRBS and Cancer based on selected state
                var PRAMSSource = $filter('translate')('fs.minority.prams.footnote');
                var YRBSSource = $filter('translate')('fs.minority.yrbs.footnote');
                var CancerSource = 'Sources: 2016, NPCR Cancer Statistics, † Female only, †† Male only';
                if(fsc.notParticipateStates['PRAMS'].states.indexOf(fsc.state) > -1) {
                    PRAMSSource = 'This state did not take part in PRAMS';
                }
                if(fsc.notParticipateStates['YRBS'].states.indexOf(fsc.state) > -1) {
                    YRBSSource = 'This state did not take part in YRBS';
                }
                if(fsc.notParticipateStates['CancerIncidence'].states.indexOf(fsc.state) > -1) {
                    CancerSource = 'Sources: 2016, NPCR Cancer Statistics, † Female only, †† Male only. The state did not meet the United States Cancer Statistics (USCS) publication standard or did not allow permission for their data to be used.';
                }
                pdfDefinition.footer = function(page, pages) {
                    return {
                        columns: [
                            { text: [
                                    {text: 'This factsheet is last updated on '
                                        + $filter('translate')('app.revision.date')+' and downloaded from', style: 'footer'},
                                    {text: ' Health Information Gateway', link: 'http://gateway.womenshealth.gov/',  style: 'footerLink'}
                                ]
                            },
                            {
                                alignment: 'right',
                                text: [
                                    { text: page.toString(), italics: true, style: 'footer' },
                                    { text: ' of ', italics: true, style: 'footer'},
                                    { text: pages.toString(), italics: true, style: 'footer' }
                                ]
                            }
                        ],
                        margin: [10, 0]
                    };
                };
                pdfDefinition.content = [
                    {image: response.data[0], width: 50, height: 50, style: 'state-image'},
                    {text: fsc.factSheetTitle, style: 'state-heading'},
                    {text: $filter('translate')('minority.factsheet.definition'), style:'factsheet-def' },
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 525-10, y2: 5, lineWidth: 0.1 }] },
                    {image: fsc.imageDataURLs.bridgeRace, width: 50, height: 50, style: 'dataset-image'},
                    {text: "Population in "+fsc.stateName, style: 'heading'},
                    {text: bridgeRaceTotalText},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.bridgeRaceTable1.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.bridgeRaceTable1.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.minority.health.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.detailMortality, width: 50, height: 50, style: 'dataset-image'},
                    {text: ['Mortality ',
                            {text:$filter('translate')('fs.rates.per.hundredK'), bold:false}],  style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( allTablesData.detailMortality.headerData, function (d, i) {
                                return i==0 ? 200 : '*';
                            } ),
                            body: detailMortalityTableData

                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.minority.health.mortality.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.infantMortality, width: 50, height: 50, style: 'dataset-image'},
                    {text: ['Infant Mortality ',
                    {text:$filter('translate')('fs.rates.per.thousand'), bold:false}], style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.infantMortality.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: infantMortalityTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.minority.infant.mortality.footnote'), style: 'info'},
                    // {image: fsc.imageDataURLs.prams, width: 50, height: 50, style: 'dataset-image', pageBreak: 'before'},
                    // {text: 'Prenatal Care and Pregnancy Risk', style: 'heading'},
                    // {
                    //     style: 'table',
                    //     table: {
                    //         widths: $.map( allTablesData.pramsTable.headerData, function (d, i) {
                    //             return '*';
                    //         }),
                    //         body: allTablesData.pramsTable.bodyData
                    //     },
                    //     layout: lightHorizontalLines
                    // },
                    // {text: PRAMSSource, style: 'info'},
                    {image: fsc.imageDataURLs.brfs, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Behavioral Risk Factors', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( allTablesData.brfss.headerData, function (d, i) {
                                return '*';
                            }),
                            body: brfssTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.minority.brfss.footnote'), style: 'info'},
                    // {image: fsc.imageDataURLs.yrbs, width: 50, height: 50, style: 'dataset-image'},
                    // {text: 'Teen Health', style: 'heading'},
                    // {
                    //     style: 'table',
                    //     table: {
                    //         widths: $.map( allTablesData.yrbs.headerData, function (d, i) {
                    //             return '*';
                    //         } ),
                    //         body: allTablesData.yrbs.bodyData
                    //     },
                    //     layout: lightHorizontalLines
                    // },
                    // {text: YRBSSource, style: 'info'},
                    {image: fsc.imageDataURLs.natality, width: 50, height: 50, style: 'dataset-image', pageBreak: 'before'},
                    {text: ['Births ',
                    {text:$filter('translate')('fs.rates.per.hundredK'), bold:false}], style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( allTablesData.natality.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: natalityTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.minority.birth.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.tb, width: 50, height: 50, style: 'dataset-image'},
                    {text: ['Tuberculosis ',
                    {text:$filter('translate')('fs.rates.per.hundredK'), bold:false}], style: 'heading'},
                    {text: 'Population: '+ $filter('number')(fsc.factSheet.tbPopulation)},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( allTablesData.tb.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.tb.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.minority.tuberculosis.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.std, width: 50, height: 50, style: 'dataset-image'},
                    {text: ['Sexually Transmitted Infections ',
                            {text:$filter('translate')('fs.rates.per.hundredK'), bold:false}], style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( allTablesData.std.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: stdTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.minority.std.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.hiv, width: 50, height: 50, style: 'dataset-image', pageBreak: 'before'},
                    {text: ['HIV/AIDS ',
                            {text:$filter('translate')('fs.hiv.rates.per.hundredK'), bold:false}],style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( allTablesData.hiv.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: hivTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.minority.aids.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.cancer, width: 50, height: 50, style: 'dataset-image'},
                    {text: ['Cancer Statistics ',
                            {text:$filter('translate')('fs.rates.per.hundredK'), bold:false}], style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( allTablesData.cancer.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: cancerTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: CancerSource, style: 'info'}
                ];

                var document = pdfMake.createPdf(pdfDefinition);
                document.download(fsc.stateName+"-"+fsc.fsTypeForTable+"-factsheet.pdf");
                return document.docDefinition;
            });
        }

        /**
         * This function generates women's of reproductive age group health fact sheet pdf
         */
        function exportWomensOfReproductiveAgeFactSheet() {
            var imageNamesForPDF = ["../client/app/images/state-shapes/"+fsc.stateImg];
            SearchService.SVGtoPNG(imageNamesForPDF).then(function(response){
                var allTablesData = prepareWomenOfReproductiveHealthTabledData();
                allTablesData.bridgeRaceTable2.bodyData = prepareTableBody(allTablesData.bridgeRaceTable2.bodyData);
                allTablesData.bridgeRaceTable2.bodyData.unshift(prepareTableHeaders(allTablesData.bridgeRaceTable2.headerData));

                allTablesData.pramsTable.bodyData = prepareTableBody(allTablesData.pramsTable.bodyData);
                allTablesData.pramsTable.bodyData.unshift(prepareTableHeaders(allTablesData.pramsTable.headerData));

                allTablesData.natalityTable.bodyData = prepareTableBody(allTablesData.natalityTable.bodyData);
                allTablesData.natalityTable.bodyData.unshift(prepareTableHeaders(allTablesData.natalityTable.headerData));

                allTablesData.brfss.bodyData = prepareTableBody(allTablesData.brfss.bodyData);
                allTablesData.brfss.bodyData.unshift(prepareTableHeaders(allTablesData.brfss.headerData));

                allTablesData.deliveryFactorsTableData.bodyData.unshift(prepareTableHeaders(allTablesData.deliveryFactorsTableData.headerData));

                var detailMortalityTableData = prepareTableBody(allTablesData.detailMortality.bodyData);
                var detailMortalityHeaders = prepareNestedTableHeaders(allTablesData.detailMortality.headerData);
                detailMortalityTableData.unshift(detailMortalityHeaders[1]);
                detailMortalityTableData.unshift(detailMortalityHeaders[0]);

                var bridgeRaceTotalText = "Total state female population: "+$filter('number')(fsc.factSheet.gender[0].bridge_race);

                var lightHorizontalLines = {
                    hLineWidth: function (i, node) {return .5;}, vLineWidth: function (i, node) {return .5;},
                    hLineColor: 'gray', vLineColor: 'gray'
                };
                var pdfDefinition = {
                    styles: {
                        'dataset-image': { alignment: 'left', margin: [0, 0, 55, -35]},
                        'state-image': { alignment: 'left', margin: [0, 0, 55, -25]},
                        'state-heading': { fontSize: 16, alignment: 'left', margin: [50, 0, 0, 0] },
                        'footer': { fontSize: 5, italics: true },
                        'footerLink': { fontSize: 5, color: '#6f399a', italics: true },
                        'heading': { fontSize: 10, bold: true, decoration: 'underline', margin: [50, 5, 0, 10]},
                        'underline': { decoration: 'underline' },
                        'tableHeader': { bold: true },
                        'table': { margin: [0, 2, 0, 2]},
                        'info': { fontSize: 6, italics: true, margin: [0, 1, 0, 0]}
                    },
                    defaultStyle: { fontSize: 8 }
                };
                //Prepare source for PRAMS, YRBS and Cancer based on selected state
                var PRAMSSource = $filter('translate')('fs.women.prams.footnote');
                var YRBSSource = $filter('translate')('fs.women.yrbs.footnote');
                var CancerSource = 'Sources: 2016, CDC NPCR , † Female only';
                if(fsc.notParticipateStates['PRAMS'].states.indexOf(fsc.state) > -1) {
                    PRAMSSource = 'This state did not take part in PRAMS';
                }
                if(fsc.notParticipateStates['YRBS'].states.indexOf(fsc.state) > -1) {
                    YRBSSource = 'This state did not take part in YRBS';
                }
                if(fsc.notParticipateStates['CancerIncidence'].states.indexOf(fsc.state) > -1) {
                    CancerSource = 'Sources: 2016, CDC NPCR , † Female only. The state did not meet the United States Cancer Statistics (USCS) publication standard or did not allow permission for their data to be used.';
                }
                pdfDefinition.footer = function(page, pages) {
                    return {
                        columns: [
                            { text: [
                                    {text: 'This factsheet is last updated on '
                                            + $filter('translate')('app.revision.date')+' and downloaded from', style: 'footer'},
                                    {text: ' Health Information Gateway', link: 'http://gateway.womenshealth.gov/',  style: 'footerLink'}
                                ]
                            },
                            {
                                alignment: 'right',
                                text: [
                                    { text: page.toString(), italics: true, style: 'footer' },
                                    { text: ' of ', italics: true, style: 'footer'},
                                    { text: pages.toString(), italics: true, style: 'footer' }
                                ]
                            }
                        ],
                        margin: [10, 0]
                    };
                };
                pdfDefinition.content = [
                    {image: response.data[0], width: 50, height: 50, style: 'state-image'},
                    {text: fsc.factSheetTitle, style: 'state-heading'},
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 525-10, y2: 5, lineWidth: 0.1 }] },
                    {image: fsc.imageDataURLs.bridgeRace, width: 50, height: 50, style: 'dataset-image'},
                    {text: "Population in " + fsc.stateName, style: 'heading'},
                    {text: bridgeRaceTotalText},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.bridgeRaceTable1.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: [
                                prepareTableHeaders(allTablesData.bridgeRaceTable1.headerData),
                                prepareTableBody(allTablesData.bridgeRaceTable1.bodyData)
                            ]
                        },
                        layout: lightHorizontalLines
                    },
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.bridgeRaceTable2.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.bridgeRaceTable2.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.health.footnote1'), style: 'info'},
                    {text: $filter('translate')('fs.women.health.footnote2'), style: 'info'},
                    {image: fsc.imageDataURLs.detailMortality, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Mortality',  style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( detailMortalityTableData[0], function (d, i) {
                                return i==0 ?  200: '*';
                            }),
                            body: detailMortalityTableData

                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.health.mortality.footnote1'), style: 'info'},
                    {text: $filter('translate')('fs.women.health.mortality.footnote2'), style: 'info'},
                    {text: $filter('translate')('fs.women.health.mortality.footnote3'), style: 'info'},
                    {image: fsc.imageDataURLs.prams, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Prenatal Care and Pregnancy Risk', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.pramsTable.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.pramsTable.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: PRAMSSource, style: 'info', pageBreak: 'after'} ,
                    {image: fsc.imageDataURLs.natality, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Pregnancy Risk Factors', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.natalityTable.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.natalityTable.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.natality.footnote'), style: 'info'},

                    {image: fsc.imageDataURLs.natality, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Delivery Factors', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.deliveryFactorsTableData.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.deliveryFactorsTableData.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.natality.footnote'), style: 'info'},

                    {image: fsc.imageDataURLs.brfs, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Behavioral Risk Factors', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.brfss.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.brfss.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.brfss.footnote'), style: 'info'}
                ];
                var document = pdfMake.createPdf(pdfDefinition);
                document.download(fsc.stateName+"-"+fsc.fsTypeForTable+"-factsheet.pdf");
                return document.docDefinition;
            });
        }
        /**
         * This function generates women's helth fact sheet pdf
         */
        function exportWomenFactSheet() {
            var imageNamesForPDF = ["../client/app/images/state-shapes/"+fsc.stateImg];
            SearchService.SVGtoPNG(imageNamesForPDF).then(function(response){
                var allTablesData = prepareWomenHealthTabledData();
                allTablesData.bridgeRaceTable2.bodyData = prepareTableBody(allTablesData.bridgeRaceTable2.bodyData);
                allTablesData.bridgeRaceTable2.bodyData.unshift(prepareTableHeaders(allTablesData.bridgeRaceTable2.headerData));

                allTablesData.pramsTable.bodyData = prepareTableBody(allTablesData.pramsTable.bodyData);
                allTablesData.pramsTable.bodyData.unshift(prepareTableHeaders(allTablesData.pramsTable.headerData));

                allTablesData.natalityTable.bodyData = prepareTableBody(allTablesData.natalityTable.bodyData);
                allTablesData.natalityTable.bodyData.unshift(prepareTableHeaders(allTablesData.natalityTable.headerData));

                allTablesData.brfss.bodyData = prepareTableBody(allTablesData.brfss.bodyData);
                allTablesData.brfss.bodyData.unshift(prepareTableHeaders(allTablesData.brfss.headerData));

                allTablesData.yrbsTable.bodyData = prepareTableBody(allTablesData.yrbsTable.bodyData);
                allTablesData.yrbsTable.bodyData.unshift(prepareTableHeaders(allTablesData.yrbsTable.headerData));

                var hivTableData = prepareTableBody(allTablesData.hiv.bodyData);
                var hivTableDataHeaders = prepareNestedTableHeaders(allTablesData.hiv.headerData);
                hivTableData.unshift(hivTableDataHeaders[1]);
                hivTableData.unshift(hivTableDataHeaders[0]);

                var stdTableData = prepareTableBody(allTablesData.std.bodyData);
                var stdTableDataHeaders = prepareNestedTableHeaders(allTablesData.std.headerData);
                stdTableData.unshift(stdTableDataHeaders[1]);
                stdTableData.unshift(stdTableDataHeaders[0]);

                var cancerTableData = prepareTableBody(allTablesData.cancer.bodyData);
                var cancerTableDataHeaders = prepareNestedTableHeaders(allTablesData.cancer.headerData);
                cancerTableData.unshift(cancerTableDataHeaders[1]);
                cancerTableData.unshift(cancerTableDataHeaders[0]);

                var detailMortalityTableData = prepareTableBody(allTablesData.detailMortality.bodyData);
                var detailMortalityHeaders = prepareNestedTableHeaders(allTablesData.detailMortality.headerData);
                detailMortalityTableData.unshift(detailMortalityHeaders[1]);
                detailMortalityTableData.unshift(detailMortalityHeaders[0]);

                var bridgeRaceTotalText = "Total state female population: "+$filter('number')(fsc.factSheet.gender[0].bridge_race);

                var lightHorizontalLines = {
                    hLineWidth: function (i, node) {return .5;}, vLineWidth: function (i, node) {return .5;},
                    hLineColor: 'gray', vLineColor: 'gray'
                };
                var pdfDefinition = {
                    styles: {
                        'dataset-image': { alignment: 'left', margin: [0, 0, 55, -35]},
                        'state-image': { alignment: 'left', margin: [0, 0, 55, -25]},
                        'state-heading': { fontSize: 16, alignment: 'left', margin: [50, 0, 0, 0] },
                        'footer': { fontSize: 5, italics: true },
                        'footerLink': { fontSize: 5, color: '#6f399a', italics: true },
                        'heading': { fontSize: 10, bold: true, decoration: 'underline', margin: [50, 5, 0, 10]},
                        'underline': { decoration: 'underline' },
                        'tableHeader': { bold: true },
                        'table': { margin: [0, 2, 0, 2]},
                        'info': { fontSize: 6, italics: true, margin: [0, 1, 0, 0]}
                    },
                    defaultStyle: { fontSize: 8 }
                };
                //Prepare source for PRAMS, YRBS and Cancer based on selected state
                var PRAMSSource = $filter('translate')('fs.women.prams.footnote');
                var YRBSSource = $filter('translate')('fs.women.yrbs.footnote');
                var CancerSource = 'Sources: 2016, CDC NPCR , † Female only';
                if(fsc.notParticipateStates['PRAMS'].states.indexOf(fsc.state) > -1) {
                    PRAMSSource = 'This state did not take part in PRAMS';
                }
                if(fsc.notParticipateStates['YRBS'].states.indexOf(fsc.state) > -1) {
                    YRBSSource = 'This state did not take part in YRBS';
                }
                if(fsc.notParticipateStates['CancerIncidence'].states.indexOf(fsc.state) > -1) {
                    CancerSource = 'Sources: 2016, CDC NPCR , † Female only. The state did not meet the United States Cancer Statistics (USCS) publication standard or did not allow permission for their data to be used.';
                }
                pdfDefinition.footer = function(page, pages) {
                    return {
                        columns: [
                            { text: [
                                    {text: 'This factsheet is last updated on '
                                        + $filter('translate')('app.revision.date')+' and downloaded from', style: 'footer'},
                                    {text: ' Health Information Gateway', link: 'http://gateway.womenshealth.gov/',  style: 'footerLink'}
                                ]
                            },
                            {
                                alignment: 'right',
                                text: [
                                    { text: page.toString(), italics: true, style: 'footer' },
                                    { text: ' of ', italics: true, style: 'footer'},
                                    { text: pages.toString(), italics: true, style: 'footer' }
                                ]
                            }
                        ],
                        margin: [10, 0]
                    };
                };
                pdfDefinition.content = [
                    {image: response.data[0], width: 50, height: 50, style: 'state-image'},
                    {text: fsc.factSheetTitle, style: 'state-heading'},
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 525-10, y2: 5, lineWidth: 0.1 }] },
                    {image: fsc.imageDataURLs.bridgeRace, width: 50, height: 50, style: 'dataset-image'},
                    {text: "Population in " + fsc.stateName, style: 'heading'},
                    {text: bridgeRaceTotalText},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.bridgeRaceTable1.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: [
                                prepareTableHeaders(allTablesData.bridgeRaceTable1.headerData),
                                prepareTableBody(allTablesData.bridgeRaceTable1.bodyData)
                            ]
                        },
                        layout: lightHorizontalLines
                    },
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.bridgeRaceTable2.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.bridgeRaceTable2.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.health.footnote1'), style: 'info'},
                    {text: $filter('translate')('fs.women.health.footnote2'), style: 'info'},
                    {image: fsc.imageDataURLs.detailMortality, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Mortality',  style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( detailMortalityTableData[0], function (d, i) {
                                return i==0 ?  200: '*';
                            }),
                            body: detailMortalityTableData

                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.health.mortality.footnote1'), style: 'info'},
                    {text: $filter('translate')('fs.women.health.mortality.footnote2'), style: 'info'},
                    {text: $filter('translate')('fs.women.health.mortality.footnote3'), style: 'info'},
                    {image: fsc.imageDataURLs.prams, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Prenatal Care and Pregnancy Risk', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.pramsTable.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.pramsTable.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: PRAMSSource, style: 'info', pageBreak: 'after'},
                    {image: fsc.imageDataURLs.natality, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Maternal Risk Factors', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.natalityTable.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.natalityTable.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.natality.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.brfs, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Behavioral Risk Factors', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.brfss.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.brfss.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.brfss.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.yrbs, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Teen Health', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: $.map( allTablesData.yrbsTable.headerData, function (d, i) {
                                return '*';
                            } ),
                            body: allTablesData.yrbsTable.bodyData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: YRBSSource, style: 'info'},
                    {image: fsc.imageDataURLs.std, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Sexually Transmitted Infections', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( stdTableData[0], function (d, i) {
                                return i==0 ? 200 : '*';
                            } ),
                            body: stdTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.std.footnote'), style: 'info', pageBreak: 'after'},
                    {image: fsc.imageDataURLs.hiv, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'HIV/AIDS', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( hivTableData[0], function (d, i) {
                                return i==0 ? 200 : '*';
                            } ),
                            body: hivTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: $filter('translate')('fs.women.aids.footnote'), style: 'info'},
                    {image: fsc.imageDataURLs.cancer, width: 50, height: 50, style: 'dataset-image'},
                    {text: 'Cancer Statistics', style: 'heading'},
                    {
                        style: 'table',
                        table: {
                            widths: $.map( cancerTableData[0], function (d, i) {
                                return '*';
                            } ),
                            body: cancerTableData
                        },
                        layout: lightHorizontalLines
                    },
                    {text: CancerSource, style: 'info'}

                ];
                var document = pdfMake.createPdf(pdfDefinition);
                document.download(fsc.stateName+"-"+fsc.fsTypeForTable+"-factsheet.pdf");
                return document.docDefinition;
            });
        }

        function getStateName(key) {
            return fsc.states[key];
        }
        $scope.redirectToMortalityPage = function(){
            $state.go('search');
        };

        function getMeanDisplayValue(data) {
            var displayValue;
            if (data) {
                if (data === 'suppressed') {
                    displayValue = 'Suppressed';
                }
                else if (data === 'na') {
                    displayValue = 'No response';
                }
                else if (data === 'Not applicable') {
                    displayValue = 'Not applicable';
                }
                else {
                    displayValue = data + "%";
                }
            } else {
                displayValue = "0.0%";
            }
            return displayValue;
        }
        function isValueInvalidDisplay(value) {
            if(['suppressed', 'not available', 'not applicable'].indexOf(new String(value).toLowerCase())>=0) {
                return true;
            }
            return false;
        }
        function findByKey(array, key, value) { 
            return array.filter(function(item) { 
                return item[key] === value; 
            })[0];
         }
        function calculateRate(count, totalPopulation, checkReliability) {
            if(count === undefined) {
                return 'Not available';
            } if(count === 'suppressed') {
                return 'Suppressed';
            } else if(count === 'Not available') {
                return 'Not available';
            } else if(count === 'na') {
                return 'Not applicable';
            } else if (checkReliability) {
                if(count < 20) {
                    return 'Unreliable';
                } else {
                    return totalPopulation != 'n/a' ? $filter('number')(count / totalPopulation * 1000000 / 10, 1) : "Not available";
                }
            }
            else {
                var rates =  totalPopulation ? count / totalPopulation * 1000000 / 10 : 0;
                return $filter('number')(rates, 1);
            }
        }

        function isNumeric(num) {
            return !isNaN(num);
        }

        function getCancerCountDisplayVal(count) {
            if (fsc.state === 'KS') {
                return 'Not available';
            } else if(count === 'suppressed') {
              return 'Suppressed';
            } else {
                return $filter('number')(count);
            }
        }
    }
}());