# Cours Complet Solidity - Approche Pratique

## Table des Matières
1. [Introduction et Configuration](#introduction)
2. [Syntaxe de Base](#syntaxe-de-base)
3. [Types de Données](#types-de-données)
4. [Fonctions et Modificateurs](#fonctions-et-modificateurs)
5. [Contrats et Héritage](#contrats-et-héritage)
6. [Gestion des Erreurs](#gestion-des-erreurs)
7. [Patterns Avancés](#patterns-avancés)
8. [Sécurité](#sécurité)
9. [Projets Pratiques](#projets-pratiques)

---

## 1. Introduction et Configuration {#introduction}

### Qu'est-ce que Solidity ?
Solidity est un langage de programmation orienté contrat pour écrire des smart contracts sur Ethereum et d'autres blockchains compatibles EVM.

### Configuration de l'Environnement

**Option 1 : Remix IDE (Recommandé pour débuter)**
- Accédez à https://remix.ethereum.org
- Interface web complète avec compilateur intégré

**Option 2 : Hardhat (Pour projets avancés)**
```bash
npm init -y
npm install --save-dev hardhat
npx hardhat
```

### Premier Contrat

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HelloWorld {
    string public message;
    
    constructor() {
        message = "Hello, Blockchain!";
    }
    
    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
```

**Exercice Pratique 1:**
Créez un contrat `PersonalInfo` qui stocke votre nom, âge et permet de les modifier.

---

## 2. Syntaxe de Base {#syntaxe-de-base}

### Structure d'un Contrat

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Imports
import "./OtherContract.sol";

// Contrat principal
contract MyContract {
    // Variables d'état
    uint256 public counter;
    address public owner;
    
    // Events
    event CounterIncremented(uint256 newValue);
    
    // Modificateurs
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    // Constructeur
    constructor() {
        owner = msg.sender;
        counter = 0;
    }
    
    // Fonctions
    function increment() public onlyOwner {
        counter++;
        emit CounterIncremented(counter);
    }
}
```

### Variables Globales Importantes

```solidity
contract GlobalVariables {
    function getBlockInfo() public view returns (
        uint256 blockNumber,
        uint256 timestamp,
        address sender,
        uint256 value
    ) {
        return (
            block.number,      // Numéro du bloc actuel
            block.timestamp,   // Timestamp du bloc
            msg.sender,        // Adresse qui appelle la fonction
            msg.value          // Ether envoyé avec la transaction
        );
    }
}
```

---

## 3. Types de Données {#types-de-données}

### Types Primitifs

```solidity
contract DataTypes {
    // Entiers
    uint256 public largeNumber = 1000000;
    uint8 public smallNumber = 255;
    int256 public signedNumber = -100;
    
    // Booléens
    bool public isActive = true;
    
    // Adresses
    address public userAddress;
    address payable public payableAddress;
    
    // Bytes
    bytes32 public hash;
    bytes public dynamicBytes;
    
    // Chaînes
    string public name = "Solidity";
    
    function setPayableAddress(address payable _addr) public {
        payableAddress = _addr;
    }
}
```

### Arrays et Mappings

```solidity
contract ArraysAndMappings {
    // Arrays statiques
    uint256[5] public fixedArray;
    
    // Arrays dynamiques
    uint256[] public dynamicArray;
    string[] public names;
    
    // Mappings
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
    
    // Structs
    struct User {
        string name;
        uint256 age;
        address wallet;
    }
    
    mapping(address => User) public users;
    User[] public allUsers;
    
    function addUser(string memory _name, uint256 _age) public {
        users[msg.sender] = User(_name, _age, msg.sender);
        allUsers.push(users[msg.sender]);
    }
    
    function addToArray(uint256 _value) public {
        dynamicArray.push(_value);
    }
    
    function getArrayLength() public view returns (uint256) {
        return dynamicArray.length;
    }
    
    function setBalance(address _user, uint256 _amount) public {
        balances[_user] = _amount;
    }
}
```

**Exercice Pratique 2:**
Créez un contrat de carnet d'adresses qui permet d'ajouter, modifier et supprimer des contacts avec nom, email et téléphone.

---

## 4. Fonctions et Modificateurs {#fonctions-et-modificateurs}

### Types de Fonctions

```solidity
contract FunctionTypes {
    uint256 public count = 0;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // Function pure - ne lit ni modifie l'état
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
    
    // Function view - lit l'état mais ne le modifie pas
    function getCount() public view returns (uint256) {
        return count;
    }
    
    // Function qui modifie l'état
    function increment() public {
        count++;
    }
    
    // Function payable - peut recevoir de l'Ether
    function deposit() public payable {
        // msg.value contient l'Ether envoyé
    }
    
    // Function avec plusieurs valeurs de retour
    function multipleReturns() public view returns (uint256, address, bool) {
        return (count, owner, count > 0);
    }
    
    // Function avec paramètres nommés
    function namedReturns() public view returns (
        uint256 currentCount,
        address contractOwner
    ) {
        currentCount = count;
        contractOwner = owner;
    }
}
```

### Modificateurs Avancés

```solidity
contract AdvancedModifiers {
    address public owner;
    uint256 public price = 1 ether;
    bool public paused = false;
    
    mapping(address => bool) public whitelist;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }
    
    modifier notPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier exactPayment() {
        require(msg.value == price, "Incorrect payment amount");
        _;
    }
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }
    
    function addToWhitelist(address _user) 
        public 
        onlyOwner 
        validAddress(_user) 
    {
        whitelist[_user] = true;
    }
    
    function purchase() 
        public 
        payable 
        notPaused 
        onlyWhitelisted 
        exactPayment 
    {
        // Logique d'achat
    }
    
    function pause() public onlyOwner {
        paused = true;
    }
    
    function unpause() public onlyOwner {
        paused = false;
    }
}
```

---

## 5. Contrats et Héritage {#contrats-et-héritage}

### Héritage Simple

```solidity
// Contrat de base
contract Ownable {
    address public owner;
    
    event OwnershipTransferred(address previousOwner, address newOwner);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
}

// Contrat qui hérite
contract MyToken is Ownable {
    string public name = "MyToken";
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    
    function mint(address to, uint256 amount) public onlyOwner {
        balances[to] += amount;
        totalSupply += amount;
    }
}
```

### Héritage Multiple et Interfaces

```solidity
// Interface
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

// Contrat abstrait
abstract contract Pausable {
    bool private _paused;
    
    event Paused(address account);
    event Unpaused(address account);
    
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }
    
    function paused() public view returns (bool) {
        return _paused;
    }
    
    function _pause() internal {
        _paused = true;
        emit Paused(msg.sender);
    }
    
    function _unpause() internal {
        _paused = false;
        emit Unpaused(msg.sender);
    }
}

// Héritage multiple
contract AdvancedToken is IERC20, Ownable, Pausable {
    string public name;
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    
    constructor(string memory _name) {
        name = _name;
    }
    
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        returns (bool) 
    {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        return true;
    }
    
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
}
```

**Exercice Pratique 3:**
Créez un système de vote qui hérite d'un contrat `Ownable` et implémente une interface `IVoting`.

---

## 6. Gestion des Erreurs {#gestion-des-erreurs}

### Methods de Gestion d'Erreurs

```solidity
contract ErrorHandling {
    uint256 public balance = 100;
    address public owner;
    
    // Erreurs personnalisées (Gas efficient)
    error InsufficientBalance(uint256 requested, uint256 available);
    error NotAuthorized(address caller);
    error InvalidAmount();
    
    constructor() {
        owner = msg.sender;
    }
    
    // Utilisation de require
    function withdrawWithRequire(uint256 amount) public {
        require(msg.sender == owner, "Not authorized");
        require(amount > 0, "Amount must be positive");
        require(amount <= balance, "Insufficient balance");
        
        balance -= amount;
    }
    
    // Utilisation d'erreurs personnalisées
    function withdrawWithCustomError(uint256 amount) public {
        if (msg.sender != owner) {
            revert NotAuthorized(msg.sender);
        }
        if (amount == 0) {
            revert InvalidAmount();
        }
        if (amount > balance) {
            revert InsufficientBalance(amount, balance);
        }
        
        balance -= amount;
    }
    
    // Utilisation d'assert (pour des conditions qui ne devraient jamais être fausses)
    function criticalOperation() public {
        uint256 oldBalance = balance;
        balance = balance * 2;
        
        // Ceci ne devrait jamais échouer si notre logique est correcte
        assert(balance >= oldBalance);
    }
    
    // Try/Catch pour les appels externes
    function callExternalContract(address target) public returns (bool success) {
        try ExternalContract(target).riskyFunction() returns (uint256 result) {
            // Succès
            return true;
        } catch Error(string memory reason) {
            // Erreur avec message
            // Log ou handle l'erreur
            return false;
        } catch (bytes memory lowLevelData) {
            // Erreur de bas niveau
            return false;
        }
    }
}

contract ExternalContract {
    function riskyFunction() external pure returns (uint256) {
        // Fonction qui peut échouer
        return 42;
    }
}
```

---

## 7. Patterns Avancés {#patterns-avancés}

### Pattern Factory

```solidity
contract Token {
    string public name;
    string public symbol;
    address public creator;
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        creator = msg.sender;
    }
}

contract TokenFactory {
    Token[] public deployedTokens;
    mapping(address => Token[]) public userTokens;
    
    event TokenCreated(address tokenAddress, address creator);
    
    function createToken(string memory _name, string memory _symbol) public {
        Token newToken = new Token(_name, _symbol);
        deployedTokens.push(newToken);
        userTokens[msg.sender].push(newToken);
        
        emit TokenCreated(address(newToken), msg.sender);
    }
    
    function getDeployedTokensCount() public view returns (uint256) {
        return deployedTokens.length;
    }
    
    function getUserTokens(address user) public view returns (Token[] memory) {
        return userTokens[user];
    }
}
```

### Pattern Proxy (Upgradeable)

```solidity
contract LogicV1 {
    uint256 public value;
    
    function setValue(uint256 _value) public {
        value = _value;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}

contract SimpleProxy {
    address public implementation;
    address public admin;
    
    constructor(address _implementation) {
        implementation = _implementation;
        admin = msg.sender;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    function upgrade(address _newImplementation) public onlyAdmin {
        implementation = _newImplementation;
    }
    
    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}
```

### Pattern Oracle

```solidity
interface IPriceOracle {
    function getPrice(string memory symbol) external view returns (uint256);
}

contract PriceOracle is IPriceOracle {
    mapping(string => uint256) private prices;
    mapping(address => bool) public oracles;
    address public admin;
    
    event PriceUpdated(string symbol, uint256 price, address oracle);
    
    constructor() {
        admin = msg.sender;
        oracles[msg.sender] = true;
    }
    
    modifier onlyOracle() {
        require(oracles[msg.sender], "Not an oracle");
        _;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    function addOracle(address _oracle) public onlyAdmin {
        oracles[_oracle] = true;
    }
    
    function updatePrice(string memory symbol, uint256 price) public onlyOracle {
        prices[symbol] = price;
        emit PriceUpdated(symbol, price, msg.sender);
    }
    
    function getPrice(string memory symbol) public view override returns (uint256) {
        require(prices[symbol] > 0, "Price not available");
        return prices[symbol];
    }
}

contract TradingContract {
    IPriceOracle public oracle;
    
    constructor(address _oracle) {
        oracle = IPriceOracle(_oracle);
    }
    
    function calculateValue(string memory symbol, uint256 amount) 
        public 
        view 
        returns (uint256) 
    {
        uint256 price = oracle.getPrice(symbol);
        return (amount * price) / 1e18;
    }
}
```

---

## 8. Sécurité {#sécurité}

### Attaques Communes et Protections

```solidity
contract SecurityBestPractices {
    mapping(address => uint256) public balances;
    mapping(address => bool) private _noReentrancy;
    
    // Protection contre la réentrance
    modifier nonReentrant() {
        require(!_noReentrancy[msg.sender], "Reentrant call");
        _noReentrancy[msg.sender] = true;
        _;
        _noReentrancy[msg.sender] = false;
    }
    
    // Éviter les débordements (overflow/underflow)
    function safeAdd(uint256 a, uint256 b) public pure returns (uint256) {
        uint256 result = a + b;
        require(result >= a, "Overflow detected");
        return result;
    }
    
    function safeSub(uint256 a, uint256 b) public pure returns (uint256) {
        require(b <= a, "Underflow detected");
        return a - b;
    }
    
    // Pattern Checks-Effects-Interactions
    function withdraw(uint256 amount) public nonReentrant {
        // Checks
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Effects
        balances[msg.sender] -= amount;
        
        // Interactions
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // Protection contre les attaques de front-running
    mapping(bytes32 => bool) public commitments;
    
    function commitBid(bytes32 commitment) public {
        commitments[commitment] = true;
    }
    
    function revealBid(uint256 amount, uint256 nonce) public {
        bytes32 commitment = keccak256(abi.encodePacked(amount, nonce, msg.sender));
        require(commitments[commitment], "Invalid commitment");
        
        // Process bid
        delete commitments[commitment];
    }
    
    // Validation d'adresses
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        require(_addr != address(this), "Cannot be contract address");
        _;
    }
    
    // Limites de gas pour éviter les DoS
    uint256 constant MAX_ARRAY_LENGTH = 100;
    
    function processArray(uint256[] memory data) public {
        require(data.length <= MAX_ARRAY_LENGTH, "Array too large");
        
        for (uint256 i = 0; i < data.length; i++) {
            // Process data
        }
    }
}
```

### Circuit Breaker Pattern

```solidity
contract CircuitBreaker {
    bool public stopped = false;
    address public owner;
    uint256 public lastActivity;
    uint256 public constant EMERGENCY_TIMEOUT = 1 days;
    
    modifier stopInEmergency {
        require(!stopped, "Contract is stopped");
        _;
    }
    
    modifier onlyInEmergency {
        require(stopped, "Contract is not stopped");
        _;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        lastActivity = block.timestamp;
    }
    
    function emergencyStop() public onlyOwner {
        stopped = true;
    }
    
    function resume() public onlyOwner {
        stopped = false;
    }
    
    // Fonction normale protégée
    function normalFunction() public stopInEmergency {
        lastActivity = block.timestamp;
        // Logique normale
    }
    
    // Fonction d'urgence
    function emergencyWithdraw() public onlyInEmergency {
        // Logique de retrait d'urgence
    }
}
```

**Exercice Pratique 4:**
Créez un contrat de crowdfunding sécurisé avec protection contre la réentrance et circuit breaker.

---

## 9. Projets Pratiques {#projets-pratiques}

### Projet 1: Système de Vote Décentralisé

```solidity
contract DecentralizedVoting {
    struct Proposal {
        string description;
        uint256 voteCount;
        uint256 deadline;
        bool executed;
        mapping(address => bool) voted;
    }
    
    struct Voter {
        bool isRegistered;
        uint256 votingPower;
        bool hasVoted;
    }
    
    address public chairman;
    mapping(address => Voter) public voters;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    event VoterRegistered(address voter);
    event ProposalCreated(uint256 proposalId, string description);
    event VoteCast(uint256 proposalId, address voter);
    event ProposalExecuted(uint256 proposalId);
    
    modifier onlyChairman() {
        require(msg.sender == chairman, "Only chairman");
        _;
    }
    
    modifier onlyRegistered() {
        require(voters[msg.sender].isRegistered, "Not registered");
        _;
    }
    
    constructor() {
        chairman = msg.sender;
    }
    
    function registerVoter(address _voter, uint256 _votingPower) 
        public 
        onlyChairman 
    {
        require(!voters[_voter].isRegistered, "Already registered");
        
        voters[_voter] = Voter({
            isRegistered: true,
            votingPower: _votingPower,
            hasVoted: false
        });
        
        emit VoterRegistered(_voter);
    }
    
    function createProposal(string memory _description, uint256 _duration) 
        public 
        onlyChairman 
    {
        uint256 proposalId = proposalCount++;
        Proposal storage newProposal = proposals[proposalId];
        newProposal.description = _description;
        newProposal.deadline = block.timestamp + _duration;
        
        emit ProposalCreated(proposalId, _description);
    }
    
    function vote(uint256 _proposalId) public onlyRegistered {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!proposal.voted[msg.sender], "Already voted");
        
        proposal.voted[msg.sender] = true;
        proposal.voteCount += voters[msg.sender].votingPower;
        
        emit VoteCast(_proposalId, msg.sender);
    }
    
    function executeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.deadline, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.voteCount > 0, "No votes");
        
        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }
}
```

### Projet 2: Marketplace NFT

```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
    
    IERC721 public nftContract;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public earnings;
    
    uint256 public platformFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    event ItemListed(uint256 tokenId, address seller, uint256 price);
    event ItemSold(uint256 tokenId, address seller, address buyer, uint256 price);
    event ListingCanceled(uint256 tokenId);
    
    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }
    
    function listItem(uint256 _tokenId, uint256 _price) public {
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not owner");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "Not approved");
        require(_price > 0, "Price must be positive");
        
        listings[_tokenId] = Listing({
            seller: msg.sender,
            price: _price,
            active: true
        });
        
        emit ItemListed(_tokenId, msg.sender, _price);
    }
    
    function buyItem(uint256 _tokenId) public payable {
        Listing storage listing = listings[_tokenId];
        require(listing.active, "Item not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        
        address seller = listing.seller;
        uint256 price = listing.price;
        
        listing.active = false;
        
        uint256 fee = (price * platformFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = price - fee;
        
        earnings[seller] += sellerAmount;
        earnings[owner()] += fee;
        
        nftContract.safeTransferFrom(seller, msg.sender, _tokenId);
        
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit ItemSold(_tokenId, seller, msg.sender, price);
    }
    
    function cancelListing(uint256 _tokenId) public {
        require(listings[_tokenId].seller == msg.sender, "Not your listing");
        require(listings[_tokenId].active, "Listing not active");
        
        listings[_tokenId].active = false;
        emit ListingCanceled(_tokenId);
    }
    
    function withdraw() public {
        uint256 amount = earnings[msg.sender];
        require(amount > 0, "No earnings");
        
        earnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
    
    function setPlatformFee(uint256 _fee) public onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        platformFee = _fee;
    }
}
```

### Projet 3: Système DeFi Simple (Staking)

```solidity
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract StakingPool {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    
    uint256 public rewardRate = 100; // tokens per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public totalStaked;
    
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    
    event Staked(address user, uint256 amount);
    event Withdrawn(address user, uint256 amount);
    event RewardPaid(address user, uint256 reward);
    
    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        lastUpdateTime = block.timestamp;
    }
    
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
    
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        
        return rewardPerTokenStored + 
            ((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalStaked;
    }
    
    function earned(address account) public view returns (uint256) {
        return ((stakedBalance[account] * 
            (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) + 
            rewards[account];
    }
    
    function stake(uint256 amount) public updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        totalStaked += amount;
        stakedBalance[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) public updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient balance");
        
        totalStaked -= amount;
        stakedBalance[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function claimReward() public updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }
    
    function exit() external {
        withdraw(stakedBalance[msg.sender]);
        claimReward();
    }
}
```

---

## 10. Optimisation du Gas et Bonnes Pratiques

### Techniques d'Optimisation

```solidity
contract GasOptimization {
    // ❌ Mauvais: lecture multiple du storage
    function badExample() public view returns (uint256) {
        uint256 total = 0;
        for (uint i = 0; i < myArray.length; i++) {
            total += myArray[i];
        }
        return total;
    }
    
    uint256[] public myArray;
    
    // ✅ Bon: cache en mémoire
    function goodExample() public view returns (uint256) {
        uint256[] memory localArray = myArray;
        uint256 total = 0;
        uint256 length = localArray.length;
        
        for (uint256 i = 0; i < length; i++) {
            total += localArray[i];
        }
        return total;
    }
    
    // Utilisation de packed structs
    struct OptimizedStruct {
        uint128 value1;  // 16 bytes
        uint128 value2;  // 16 bytes - même slot
        address user;    // 20 bytes
        uint96 smallValue; // 12 bytes - même slot que address
    }
    
    // Utilisation d'events pour stockage bon marché
    event DataStored(address indexed user, uint256 indexed timestamp, bytes data);
    
    function storeDataCheaply(bytes calldata data) external {
        emit DataStored(msg.sender, block.timestamp, data);
    }
    
    // Batch operations
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) 
        external 
    {
        require(recipients.length == amounts.length, "Length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            // Transfer logic
        }
    }
}
```

### Pattern Assembly pour Ultra-Optimisation

```solidity
contract AssemblyOptimizations {
    function efficientHash(bytes memory data) public pure returns (bytes32) {
        bytes32 result;
        assembly {
            result := keccak256(add(data, 0x20), mload(data))
        }
        return result;
    }
    
    function efficientTransfer(address to, uint256 amount) external {
        assembly {
            let success := call(gas(), to, amount, 0, 0, 0, 0)
            if iszero(success) {
                revert(0, 0)
            }
        }
    }
}
```

---

## 11. Tests et Débogage

### Tests avec Hardhat

```javascript
// test/MyContract.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyContract", function () {
    let contract;
    let owner;
    let addr1;
    
    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        
        const MyContract = await ethers.getContractFactory("MyContract");
        contract = await MyContract.deploy();
        await contract.deployed();
    });
    
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await contract.owner()).to.equal(owner.address);
        });
    });
    
    describe("Functionality", function () {
        it("Should allow owner to set value", async function () {
            await contract.setValue(100);
            expect(await contract.value()).to.equal(100);
        });
        
        it("Should revert if non-owner tries to set value", async function () {
            await expect(
                contract.connect(addr1).setValue(100)
            ).to.be.revertedWith("Not the owner");
        });
    });
});
```

### Debugging avec Events

```solidity
contract DebuggableContract {
    event DebugLog(string message, uint256 value);
    event DebugAddress(string message, address addr);
    
    function complexFunction(uint256 input) public {
        emit DebugLog("Input received", input);
        
        uint256 processed = input * 2;
        emit DebugLog("After processing", processed);
        
        if (processed > 100) {
            emit DebugLog("Large value detected", processed);
            // Handle large values
        }
    }
}
```

---

## 12. Déploiement et Interaction

### Script de Déploiement Hardhat

```javascript
// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.utils.formatEther(balance));
    
    // Deploy contract
    const MyContract = await ethers.getContractFactory("MyContract");
    const contract = await MyContract.deploy("Constructor Argument");
    
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);
    
    // Verify deployment
    const owner = await contract.owner();
    console.log("Contract owner:", owner);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

### Configuration Hardhat

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545"
        },
        goerli: {
            url: process.env.GOERLI_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        mainnet: {
            url: process.env.MAINNET_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
};
```

---

## 13. Exercices Pratiques Finaux

### Exercice 5: Système de Prêt DeFi
Créez un contrat qui permet:
- Déposer des tokens en garantie
- Emprunter jusqu'à 75% de la valeur déposée
- Calculer et appliquer des intérêts
- Liquider les positions sous-collatéralisées

### Exercice 6: DAO (Organisation Autonome Décentralisée)
Implémentez:
- Système de gouvernance par tokens
- Propositions avec votes pondérés
- Exécution automatique des propositions approuvées
- Trésorerie communautaire

### Exercice 7: Jeu Blockchain
Développez un jeu simple avec:
- NFTs représentant des personnages
- Système de combat
- Récompenses en tokens
- Marketplace intégré

---

## 14. Ressources et Outils

### Outils de Développement
- **Remix IDE**: Environnement de développement web
- **Hardhat**: Framework de développement local
- **Truffle**: Alternative à Hardhat
- **Foundry**: Framework rapide en Rust

### Outils d'Audit et Sécurité
- **Slither**: Analyseur statique
- **MythX**: Plateforme d'analyse de sécurité
- **Echidna**: Fuzzing pour smart contracts

### Bibliothèques Utiles
- **OpenZeppelin**: Contrats sécurisés et testés
- **Chainlink**: Oracles décentralisés
- **Uniswap**: Protocoles DeFi

### Testnets pour le Développement
- **Goerli**: Testnet Ethereum stable
- **Sepolia**: Nouveau testnet Ethereum
- **Mumbai**: Testnet Polygon

---

## Conclusion

Ce cours vous a donné une base solide en Solidity avec un focus sur la pratique. Les concepts clés à retenir:

1. **Sécurité First**: Toujours penser aux attaques possibles
2. **Optimisation Gas**: Chaque opération coûte de l'argent
3. **Tests Complets**: Un contrat non testé est un contrat dangereux
4. **Patterns Éprouvés**: Utilisez les patterns reconnus
5. **Veille Technologique**: L'écosystème évolue rapidement

**Prochaines Étapes:**
1. Pratiquez avec les exercices proposés
2. Participez à des hackathons
3. Contribuez à des projets open source
4. Suivez les dernières actualités DeFi/Web3
5. Considérez des audits professionnels pour vos contrats

**Ressources Continues:**
- Documentation officielle Solidity
- Forums comme Stack Overflow Ethereum
- Discord/Telegram des communautés dev
- Cours avancés sur DeFi et Layer 2

Bonne programmation et bienvenue dans l'écosystème blockchain !y


